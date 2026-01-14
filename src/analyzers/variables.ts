/**
 * 关键变量与约束识别分析器
 */

import type { VariablesAndConstraints, ReframedProblem } from "../types/index.js";

/** 目标关键词映射 */
const GOAL_KEYWORDS: Record<string, string[]> = {
  "长期收入稳定性": ["收入", "工资", "薪资", "赚钱", "财务", "经济"],
  "职业发展空间": ["发展", "成长", "晋升", "职业", "前途", "机会"],
  "生活质量": ["生活", "幸福", "快乐", "舒适", "自由"],
  "身份与安全边际": ["稳定", "安全", "保障", "身份", "绿卡", "永居"],
  "技术/技能成长": ["技术", "技能", "学习", "成长", "提升"],
  "家庭和谐": ["家庭", "孩子", "父母", "配偶", "家人"],
  "社会认可": ["地位", "面子", "认可", "尊重", "成功"],
  "个人自主权": ["自由", "自主", "选择", "控制", "独立"],
};

/** 变量关键词映射 */
const VARIABLE_KEYWORDS: Record<string, string[]> = {
  "年龄": ["年龄", "岁", "年纪", "年轻", "老了"],
  "技能可迁移性": ["技能", "能力", "经验", "专业", "技术"],
  "资金储备": ["钱", "存款", "资金", "积蓄", "财务"],
  "语言能力": ["语言", "英语", "外语", "口语"],
  "人脉网络": ["人脉", "关系", "朋友", "圈子", "资源"],
  "行业周期": ["行业", "市场", "经济", "周期", "风口"],
  "家庭状况": ["家庭", "孩子", "配偶", "父母"],
  "健康状况": ["健康", "身体", "精力"],
  "学历背景": ["学历", "学校", "专业", "教育"],
  "工作经验": ["经验", "工作", "履历", "背景"],
};

/** 约束关键词映射 */
const CONSTRAINT_KEYWORDS: Record<string, string[]> = {
  "签证/政策限制": ["签证", "政策", "移民", "绿卡", "身份"],
  "资金约束": ["钱不够", "成本", "费用", "负担不起"],
  "时间窗口": ["时间", "来不及", "年龄限制", "窗口期"],
  "家庭责任": ["家庭", "孩子", "父母", "老人", "照顾"],
  "合同/承诺约束": ["合同", "竞业", "违约", "承诺"],
  "学历/资质要求": ["学历", "资质", "证书", "认证"],
  "语言门槛": ["语言", "英语", "不会"],
  "行业准入": ["准入", "门槛", "资格", "限制"],
};

/** 不确定性关键词映射 */
const UNCERTAINTY_KEYWORDS: Record<string, string[]> = {
  "政策变化": ["政策", "法规", "政府", "制度"],
  "经济周期波动": ["经济", "市场", "行情", "周期", "环境"],
  "行业发展趋势": ["行业", "技术", "趋势", "未来"],
  "个人境遇变化": ["意外", "变故", "突发", "运气"],
  "国际形势": ["国际", "关系", "形势", "地缘"],
  "技术变革": ["AI", "技术", "变革", "替代", "自动化"],
};

/**
 * 根据关键词匹配识别要素
 */
function matchKeywords(
  text: string,
  keywordMap: Record<string, string[]>
): string[] {
  const matched: string[] = [];

  for (const [label, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        matched.push(label);
        break;
      }
    }
  }

  return matched;
}

/**
 * 获取默认目标（当无法从文本识别时）
 */
function getDefaultGoals(): string[] {
  return [
    "决策的长期价值最大化",
    "风险在可承受范围内",
    "保留调整和退出的灵活性",
  ];
}

/**
 * 获取默认变量（通用决策变量）
 */
function getDefaultVariables(): string[] {
  return [
    "个人能力与资源",
    "时间投入",
    "外部机会与环境",
  ];
}

/**
 * 获取默认约束
 */
function getDefaultConstraints(): string[] {
  return [
    "可用资源（时间、金钱、精力）的有限性",
    "信息不完整性",
  ];
}

/**
 * 获取默认不确定性
 */
function getDefaultUncertainties(): string[] {
  return [
    "外部环境变化",
    "个人境遇变化",
    "执行效果的不确定性",
  ];
}

/**
 * 分析变量与约束
 */
export function analyzeVariables(
  reframedProblem: ReframedProblem
): VariablesAndConstraints {
  const combinedText = `${reframedProblem.original} ${reframedProblem.reframed}`;

  // 识别各维度要素
  let goals = matchKeywords(combinedText, GOAL_KEYWORDS);
  let keyVariables = matchKeywords(combinedText, VARIABLE_KEYWORDS);
  let hardConstraints = matchKeywords(combinedText, CONSTRAINT_KEYWORDS);
  let uncertainties = matchKeywords(combinedText, UNCERTAINTY_KEYWORDS);

  // 确保每个维度都有内容
  if (goals.length === 0) {
    goals = getDefaultGoals();
  }
  if (keyVariables.length === 0) {
    keyVariables = getDefaultVariables();
  }
  if (hardConstraints.length === 0) {
    hardConstraints = getDefaultConstraints();
  }
  if (uncertainties.length === 0) {
    uncertainties = getDefaultUncertainties();
  }

  return {
    goals,
    keyVariables,
    hardConstraints,
    uncertainties,
  };
}
