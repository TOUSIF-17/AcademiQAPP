// Lightweight extractive TextRank summarizer (no external models)

class SummarizationService {
  sentenceSplit(text) {
    const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z(\[]|\d)/).map(s => s.trim()).filter(Boolean);
    return sentences.length > 0 ? sentences : [text.trim()];
  }
  wordSplit(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !this.stopwords.has(w));
  }
  stopwords = new Set(['a', 'an', 'and', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'for', 'to', 'of', 'by', 'with', 'as', 'that', 'this', 'it', 'from', 'at', 'be', 'or', 'we', 'our', 'their', 'his', 'her', 'they', 'them', 'these', 'those', 'which', 'into', 'than', 'then', 'also', 'can', 'may', 'might', 'have', 'has', 'had', 'do', 'does', 'did', 'using', 'used', 'based', 'such', 'between', 'within', 'over', 'under', 'more', 'most', 'less', 'least', 'been', 'being', 'both', 'each', 'other', 'through', 'per', 'via']);
  buildSimilarityMatrix(sentences) {
    const vectors = sentences.map(s => {
      const words = this.wordSplit(s);
      const counts = {};
      for (const w of words) counts[w] = (counts[w] || 0) + 1;
      return counts;
    });
    const vocab = new Set();
    for (const v of vectors) for (const k of Object.keys(v)) vocab.add(k);
    const terms = Array.from(vocab);
    const tf = vectors.map(v => terms.map(t => v[t] || 0));
    const norms = tf.map(vec => Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1);
    const n = sentences.length;
    const sim = Array.from({
      length: n
    }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dot = 0;
        for (let k = 0; k < terms.length; k++) dot += tf[i][k] * tf[j][k];
        const val = dot / (norms[i] * norms[j]);
        sim[i][j] = val;
        sim[j][i] = val;
      }
    }
    return sim;
  }
  pageRank(sim, d = 0.85, maxIter = 40, eps = 1e-4) {
    const n = sim.length;
    if (n === 0) return [];
    const scores = Array(n).fill(1 / n);
    // normalize rows
    const rowsums = sim.map(row => row.reduce((s, x) => s + x, 0) || 1);
    for (let iter = 0; iter < maxIter; iter++) {
      const prev = scores.slice();
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) if (i !== j) sum += sim[j][i] / rowsums[j] * prev[j];
        scores[i] = (1 - d) / n + d * sum;
      }
      const delta = scores.reduce((s, v, i) => s + Math.abs(v - prev[i]), 0);
      if (delta < eps) break;
    }
    return scores;
  }
  buildSummary(sentences, scores, maxWords = 150) {
    const ranked = sentences.map((_, i) => ({
      index: i,
      score: scores[i] || 0
    }));
    ranked.sort((a, b) => b.score - a.score);
    const chosen = [];
    let wordCount = 0;
    for (const r of ranked) {
      const w = this.wordSplit(sentences[r.index]).length;
      if (w === 0) continue;
      if (wordCount + w > maxWords && chosen.length > 0) break;
      chosen.push(r);
      wordCount += w;
      if (wordCount >= maxWords) break;
    }
    // preserve original order
    chosen.sort((a, b) => a.index - b.index);
    const result = chosen.map(c => sentences[c.index]).join(' ');
    return result || sentences.slice(0, 3).join(' ');
  }
  async generateSummary(text) {
    try {
      const sentences = this.sentenceSplit(text);
      if (sentences.length <= 2) {
        return text.length > 150 ? text.slice(0, 150) + '...' : text;
      }
      const sim = this.buildSimilarityMatrix(sentences);
      const scores = this.pageRank(sim);
      return this.buildSummary(sentences, scores, 150);
    } catch (error) {
      console.error('TextRank summarization error:', error);
      return text.substring(0, 250) + '...';
    }
  }
}
const summarizationService = new SummarizationService();
export default summarizationService;
