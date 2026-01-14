/**
 * 风险与回报分布分析器
 */

import type {
  RiskRewardAnalysis,
  OutcomeDistribution,
  StrategySpace,
  VariablesAndConstraints,
} from "../types/index.js";

/** 结果分布模板 */
interface DistributionTemplate {
  strategyType: string;
  distributions: Array<{
    probability: number;
    template: string;
  }>;
}

/** 各策略类型的结果分布模板 */
const DISTRIBUTION_TEMPLATES: DistributionTemplate[] = [
  {
    strategyType: "aggressive",
    distributions: [
      { probability: 20, template: "目标达成，收益符合或超出预期" },
      { probability: 35, template: "部分达成，结果低于预期但有所收获" },
      { probability: 30, template: "遇到较大阻力，需要调整计划或延长周期" },
      { probability: 15, template: "执行失败，需要承受损失并重新规划" },
    ],
  },
  {
    strategyType: "conservative",
    distributions: [
      { probability: 25, template: "等待期间情况明朗，获得更好的行动时机" },
      { probability: 30, template: "情况未明显变化，继续处于等待状态" },
      { probability: 25, template: "窗口期收窄，后续行动成本上升" },
      { probability: 20, template: "机会丧失，需要转向其他路径" },
    ],
  },
  {
    strategyType: "hedge",
    distributions: [
      { probability: 20, template: "主路径成功，备选路径平稳退出" },
      { probability: 35, template: "两条路径都有进展，需要做出最终选择" },
      { probability: 30, template: "精力分散，两条路径进展都不理想" },
      { probability: 15, template: "资源耗尽，被迫放弃其中一条或两条路径" },
    ],
  },
  {
    strategyType: "exit",
    distributions: [
      { probability: 30, template: "成功转向，新方向发展良好" },
      { probability: 35, template: "转向后需要较长适应期，短期内有阵痛" },
      { probability: 20, template: "新方向也遇到挑战，需要再次调整" },
      { probability: 15, template: "产生后悔情绪，对放弃的路径念念不忘" },
    ],
  },
];

/**
 * 根据不确定性调整概率分布
 */
function adjustForUncertainties(
  distributions: OutcomeDistribution[],
  uncertainties: string[]
): OutcomeDistribution[] {
  // 不确定性越高，极端结果（好和坏）的概率越分散
  const uncertaintyLevel = Math.min(uncertainties.length / 4, 1);

  return distributions.map((d, index) => {
    // 中间结果概率降低，极端结果概率提高
    const isMiddle = index === 1 || index === 2;
    const adjustment = isMiddle ? -5 * uncertaintyLevel : 2.5 * uncertaintyLevel;

    return {
      ...d,
      probability: Math.max(5, Math.min(50, d.probability + adjustment)),
    };
  });
}

/**
 * 标准化概率分布，确保总和为100
 */
function normalizeProbabilities(
  distributions: OutcomeDistribution[]
): OutcomeDistribution[] {
  const total = distributions.reduce((sum, d) => sum + d.probability, 0);

  return distributions.map((d) => ({
    ...d,
    probability: Math.round((d.probability / total) * 100),
  }));
}

/**
 * 分析风险与回报分布
 */
export function analyzeRisk(
  strategySpace: StrategySpace,
  variables: VariablesAndConstraints
): RiskRewardAnalysis[] {
  return strategySpace.strategies.map((strategy) => {
    // 获取对应策略类型的分布模板
    const template = DISTRIBUTION_TEMPLATES.find(
      (t) => t.strategyType === strategy.type
    );

    if (!template) {
      // 默认分布
      return {
        strategyId: strategy.id,
        strategyName: strategy.name,
        distributions: [
          { probability: 25, description: "结果好于预期" },
          { probability: 50, description: "结果符合预期" },
          { probability: 25, description: "结果低于预期" },
        ],
      };
    }

    // 生成基础分布
    let distributions: OutcomeDistribution[] = template.distributions.map((d) => ({
      probability: d.probability,
      description: d.template,
    }));

    // 根据不确定性调整
    distributions = adjustForUncertainties(distributions, variables.uncertainties);

    // 标准化概率
    distributions = normalizeProbabilities(distributions);

    return {
      strategyId: strategy.id,
      strategyName: strategy.name,
      distributions,
    };
  });
}
