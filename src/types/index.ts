/**
 * Boundary MCP 类型定义
 */

// ============ 输入类型 ============

/** 决策分析输入 */
export interface DecisionInput {
  /** 用户原始问题描述 */
  problemText: string;
}

// ============ 问题重述 ============

/** 问题去情绪化重述结果 */
export interface ReframedProblem {
  /** 原始问题 */
  original: string;
  /** 去情绪化后的问题 */
  reframed: string;
  /** 识别出的情绪化元素 */
  emotionalElements: string[];
}

// ============ 变量与约束 ============

/** 变量与约束识别结果 */
export interface VariablesAndConstraints {
  /** 目标（用户真正关心的指标） */
  goals: string[];
  /** 关键变量（可变化因素） */
  keyVariables: string[];
  /** 硬约束（不可忽视的现实限制） */
  hardConstraints: string[];
  /** 不确定性来源 */
  uncertainties: string[];
}

// ============ 策略空间 ============

/** 策略类型枚举 */
export type StrategyType = "aggressive" | "conservative" | "hedge" | "exit";

/** 单个策略 */
export interface Strategy {
  /** 策略标识 (A, B, C, D) */
  id: string;
  /** 策略名称 */
  name: string;
  /** 策略类型 */
  type: StrategyType;
  /** 策略类型描述（激进/观望/对冲/止损） */
  typeLabel: string;
  /** 前提条件 */
  preconditions: string[];
  /** 执行成本 */
  executionCost: string;
  /** 触发点 */
  triggerPoints: string[];
  /** 最坏情况 */
  worstCase: string;
}

/** 策略空间 */
export interface StrategySpace {
  strategies: Strategy[];
}

// ============ 风险回报分布 ============

/** 结果分布 */
export interface OutcomeDistribution {
  /** 概率 (0-100) */
  probability: number;
  /** 结果描述 */
  description: string;
}

/** 单个策略的风险回报分析 */
export interface RiskRewardAnalysis {
  /** 策略标识 */
  strategyId: string;
  /** 策略名称 */
  strategyName: string;
  /** 结果分布 */
  distributions: OutcomeDistribution[];
}

// ============ 认知偏差 ============

/** 认知偏差类型 */
export type BiasType =
  | "survivorship"    // 幸存者偏差
  | "narrative"       // 叙事驱动
  | "groupPressure"   // 群体压力
  | "shortTermFocus"  // 短期关注
  | "confirmationBias" // 确认偏差
  | "anchoringBias"   // 锚定效应
  | "sunkCostFallacy" // 沉没成本谬误
  | "other";          // 其他

/** 单个认知偏差 */
export interface CognitiveBias {
  /** 偏差类型 */
  type: BiasType;
  /** 偏差类型标签 */
  typeLabel: string;
  /** 具体描述 */
  description: string;
  /** 缓解建议 */
  mitigation: string;
}

/** 认知偏差警告 */
export interface BiasWarnings {
  biases: CognitiveBias[];
}

// ============ 完整分析结果 ============

/** 完整决策分析结果 */
export interface DecisionAnalysis {
  /** 问题重述 */
  reframedProblem: ReframedProblem;
  /** 变量与约束 */
  variablesAndConstraints: VariablesAndConstraints;
  /** 策略空间 */
  strategySpace: StrategySpace;
  /** 风险回报分析 */
  riskRewardAnalysis: RiskRewardAnalysis[];
  /** 认知偏差警告 */
  biasWarnings: BiasWarnings;
}

// ============ 分析上下文 ============

/** 分析过程中的上下文 */
export interface AnalysisContext {
  /** 原始输入 */
  input: DecisionInput;
  /** 问题重述结果（可选，分析过程中逐步填充） */
  reframedProblem?: ReframedProblem;
  /** 变量与约束（可选） */
  variablesAndConstraints?: VariablesAndConstraints;
  /** 策略空间（可选） */
  strategySpace?: StrategySpace;
}
