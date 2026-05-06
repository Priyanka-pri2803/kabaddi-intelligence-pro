import { GoogleGenerativeAI } from "@google/generative-ai";
import { Match, ActionType, Player } from "../../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const aiService = {
  async getTacticalInsights(match: Match) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const matchContext = {
        score: match.score,
        totalActions: match.actions?.length || 0,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        revivalQueueSize: match.revivalQueue.home.length,
        raidEfficiency: this.calculateRaidEfficiency(match),
        tackleEfficiency: this.calculateTackleEfficiency(match),
        lastFiveActions: match.actions?.slice(-5).map(a => `${a.type}: ${a.result} (+${a.points})`) || [],
      };

      const prompt = `
        You are an elite Kabaddi match intelligence engine. 
        Analyze the current state of a match between ${match.homeTeam.name} and ${match.awayTeam.name}.
        
        Score: ${match.score.home} - ${match.score.away}
        Stats: ${JSON.stringify(matchContext)}
        
        Provide:
        1. Exactly 3 professional tactical insights (JSON array of strings).
        2. A predicted win probability for the Home team (0.0 to 1.0).
        
        Response MUST be valid JSON in this format:
        {
          "insights": ["...", "...", "..."],
          "homeWinProbability": 0.65
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          insights: data.insights || ["Maintain defensive pressure.", "Optimize raid rotation.", "Watch the bonus line."],
          winProb: data.homeWinProbability || 0.5
        };
      }
      return {
        insights: ["Maintain defensive discipline.", "Focus on touch points.", "Control the tempo of the raid."],
        winProb: 0.5
      };
    } catch (error) {
      console.error("AI Insights Error:", error);
      return {
        insights: ["AI module analyzing patterns...", "Awaiting telemetry...", "Recalculating momentum..."],
        winProb: 0.5
      };
    }
  },

  async analyzePlayerPerformance(player: Player, teamMatchHistory: Match[]) {
    // Simulates AI player analysis
    const playerActions = teamMatchHistory.flatMap(m => m.actions || []).filter(a => a.playerId === player.id);
    const totalPoints = playerActions.reduce((sum, a) => sum + a.points, 0);
    
    return {
      mvpScore: Math.min(100, (totalPoints * 5) + (player.stats.efficiency * 0.5)),
      consistency: player.stats.efficiency > 60 ? "HIGH" : "MODERATE",
      tacticalRecommendation: player.role === 'RAIDER' ? "Focus on deep raids during Super Tackle situations." : "Anchor the left corner to neutralize high-speed raiders."
    };
  },

  calculateRaidEfficiency(match: Match) {
    if (!match.actions) return 0;
    const raids = match.actions.filter(a => a.type === ActionType.RAID);
    if (raids.length === 0) return 0;
    const success = raids.filter(a => a.result === 'SUCCESS' || a.result === 'SUPER_RAID').length;
    return Math.round((success / raids.length) * 100);
  },

  calculateTackleEfficiency(match: Match) {
    if (!match.actions) return 0;
    const tackles = match.actions.filter(a => a.type === ActionType.TACKLE);
    if (tackles.length === 0) return 0;
    const success = tackles.filter(a => a.result === 'SUCCESS' || a.result === 'SUPER_TACKLE').length;
    return Math.round((success / tackles.length) * 100);
  }
};
