import { GoogleGenAI } from "@google/genai";
import { Persona } from "../types";

// Initialize Gemini Client
// Note: API key is strictly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Generates personalized content for a specific persona based on a core draft.
 */
export const generatePersonaContent = async (
  draft: string,
  persona: Persona
): Promise<{ content: string; analysis: string; tags: string[] }> => {
  try {
    const prompt = `
      你是一个专业的社交媒体内容策略专家。
      
      任务：将提供的【核心素材】改写为适合特定【数字分身】和【发布平台】的文案。
      
      【核心素材】:
      "${draft}"
      
      【目标数字分身】:
      - 名称: ${persona.name}
      - 角色设定: ${persona.role}
      - 目标平台: ${persona.platform}
      - 语气风格: ${persona.tone}
      - 详细描述: ${persona.description}
      
      【要求】:
      1. 核心意图识别：首先分析核心素材的关键信息和价值观，确保改写后不偏离原意。
      2. 平台化适配：
         - 如果是 LinkedIn：专业、结构化、行业洞察、适合职场人阅读。
         - 如果是 X (Twitter)：简短有力、犀利、Thread格式（如需要）、由守门员话题引导。
         - 如果是 小红书：标题党（包含Emoji）、正文情感充沛、段落分明、Emoji丰富、文末加Tags。
         - 如果是 抖音：口语化、短句、有画面感、适合脚本朗读。
      3. 输出格式：请以JSON格式返回，不要包含Markdown代码块标记。
      
      JSON结构如下:
      {
        "content": "生成的文案内容...",
        "analysis": "简短的一句话，解释为什么这样改写以符合该Persona",
        "tags": ["tag1", "tag2", "tag3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    return {
      content: parsed.content || text,
      analysis: parsed.analysis || "AI generated",
      tags: parsed.tags || []
    };

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
