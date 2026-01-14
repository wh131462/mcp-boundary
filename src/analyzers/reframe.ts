/**
 * 问题去情绪化重述分析器
 */

import type { ReframedProblem } from "../types/index.js";

/** 情绪化词汇模式 */
const EMOTIONAL_PATTERNS = [
  { pattern: /焦虑|担心|害怕|恐惧|紧张/g, type: "焦虑情绪" },
  { pattern: /愤怒|生气|气愤|不爽|烦/g, type: "愤怒情绪" },
  { pattern: /绝望|无望|没希望|完蛋/g, type: "绝望情绪" },
  { pattern: /兴奋|激动|太棒了|amazing/gi, type: "过度兴奋" },
  { pattern: /必须|一定要|只能|不得不/g, type: "强迫性表达" },
  { pattern: /肯定会|绝对会|一定会|必然/g, type: "过度确定" },
  { pattern: /再不.*就.*来不及|错过.*机会|最后.*机会/g, type: "紧迫感假设" },
  { pattern: /别人都|大家都|很多人都|身边.*都/g, type: "群体压力" },
  { pattern: /卷|内卷|太卷|卷死/g, type: "竞争焦虑" },
  { pattern: /润|跑路|逃离|逃/g, type: "逃避性表达" },
  { pattern: /废了|完了|凉了|没戏/g, type: "灾难化思维" },
  { pattern: /是不是该|要不要|该不该/g, type: "决策焦虑" },
];

/** 预设立场模式 */
const STANCE_PATTERNS = [
  { pattern: /我觉得.*应该/g, type: "预设结论" },
  { pattern: /明显.*更好/g, type: "预设偏好" },
  { pattern: /傻子才/g, type: "贬低选项" },
  { pattern: /谁不想/g, type: "假设普遍性" },
];

/**
 * 识别文本中的情绪化元素
 */
function identifyEmotionalElements(text: string): string[] {
  const elements: string[] = [];

  for (const { pattern, type } of EMOTIONAL_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      elements.push(`${type}：'${matches.join("', '")}'`);
    }
  }

  for (const { pattern, type } of STANCE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      elements.push(`${type}：'${matches.join("', '")}'`);
    }
  }

  return elements;
}

/**
 * 提取核心决策主题
 */
function extractCoreThemes(text: string): string[] {
  const themes: string[] = [];

  // 职业/工作相关
  if (/工作|职业|转行|跳槽|offer|公司/.test(text)) {
    themes.push("职业发展");
  }

  // 地理/移居相关
  if (/出国|移民|润|国外|海外|留学/.test(text)) {
    themes.push("地理迁移");
  }

  // 教育相关
  if (/读书|学习|考研|考博|学历|深造/.test(text)) {
    themes.push("教育投资");
  }

  // 投资/财务相关
  if (/投资|理财|买房|股票|创业|赚钱/.test(text)) {
    themes.push("财务决策");
  }

  // 关系/家庭相关
  if (/结婚|离婚|分手|恋爱|家庭|孩子/.test(text)) {
    themes.push("人生关系");
  }

  return themes.length > 0 ? themes : ["人生决策"];
}

/**
 * 生成去情绪化的问题重述
 */
function generateReframedQuestion(text: string, themes: string[]): string {
  const themeStr = themes.join("与");

  // 基于主题生成结构化问题
  const templates: Record<string, string> = {
    "职业发展": `在当前个人条件（技能、经验、资源）和市场环境下，不同${themeStr}路径的长期收益与风险结构是什么？`,
    "地理迁移": `在给定个人背景、目标和约束条件下，${themeStr}相比现状的长期价值与成本结构是什么？`,
    "教育投资": `在当前阶段进行${themeStr}，其投入产出比和机会成本结构是什么？`,
    "财务决策": `${themeStr}在不同情景下的风险收益分布和个人承受能力匹配度如何？`,
    "人生关系": `${themeStr}决策涉及哪些关键变量、约束条件和不确定性？`,
    "人生决策": `该决策涉及哪些关键变量、目标、约束和不确定性因素？不同选择的结构性差异是什么？`,
  };

  return templates[themes[0]] || templates["人生决策"];
}

/**
 * 分析并重述问题
 */
export function analyzeAndReframe(problemText: string): ReframedProblem {
  const emotionalElements = identifyEmotionalElements(problemText);
  const themes = extractCoreThemes(problemText);
  const reframed = generateReframedQuestion(problemText, themes);

  return {
    original: problemText,
    reframed,
    emotionalElements,
  };
}
