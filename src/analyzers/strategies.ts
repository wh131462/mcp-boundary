/**
 * 策略空间生成分析器
 */

import type {
  Strategy,
  StrategySpace,
  StrategyType,
  ReframedProblem,
  VariablesAndConstraints,
} from "../types/index.js";

/** 策略类型配置 */
const STRATEGY_CONFIGS: Array<{
  id: string;
  type: StrategyType;
  typeLabel: string;
  nameTemplate: string;
  characteristics: {
    timing: string;
    riskLevel: string;
    resourceCommitment: string;
  };
}> = [
  {
    id: "A",
    type: "aggressive",
    typeLabel: "激进型",
    nameTemplate: "立即行动",
    characteristics: {
      timing: "立即执行",
      riskLevel: "高风险高回报",
      resourceCommitment: "全力投入",
    },
  },
  {
    id: "B",
    type: "conservative",
    typeLabel: "保守型",
    nameTemplate: "观望等待",
    characteristics: {
      timing: "延迟执行",
      riskLevel: "低风险稳健",
      resourceCommitment: "保持现状",
    },
  },
  {
    id: "C",
    type: "hedge",
    typeLabel: "对冲型",
    nameTemplate: "双轨并行",
    characteristics: {
      timing: "逐步推进",
      riskLevel: "分散风险",
      resourceCommitment: "部分投入",
    },
  },
  {
    id: "D",
    type: "exit",
    typeLabel: "止损型",
    nameTemplate: "转向放弃",
    characteristics: {
      timing: "及时止损",
      riskLevel: "规避风险",
      resourceCommitment: "转移资源",
    },
  },
];

/**
 * 生成策略前提条件
 */
function generatePreconditions(
  config: typeof STRATEGY_CONFIGS[0],
  variables: VariablesAndConstraints
): string[] {
  const preconditions: string[] = [];

  switch (config.type) {
    case "aggressive":
      preconditions.push(
        "对目标有清晰认知且决心坚定",
        "具备基本的资源和能力基础",
        "能够承受失败的最坏后果"
      );
      if (variables.keyVariables.includes("资金储备")) {
        preconditions.push("有足够的资金支持初期投入");
      }
      break;

    case "conservative":
      preconditions.push(
        "当前状态可持续，无紧迫压力",
        "等待期间有持续信息收集渠道",
        "延迟行动不会导致机会永久丧失"
      );
      break;

    case "hedge":
      preconditions.push(
        "有精力和资源同时维护多条路径",
        "两条路径之间不存在严重冲突",
        "能够设定清晰的决策触发点"
      );
      break;

    case "exit":
      preconditions.push(
        "存在可行的替代方向",
        "沉没成本在可接受范围内",
        "能够理性评估而非情绪化放弃"
      );
      break;
  }

  return preconditions;
}

/**
 * 生成执行成本描述
 */
function generateExecutionCost(
  config: typeof STRATEGY_CONFIGS[0],
  variables: VariablesAndConstraints
): string {
  const costs: string[] = [];

  switch (config.type) {
    case "aggressive":
      costs.push("时间：需要全力投入，可能持续数月至数年");
      costs.push("资金：需要前期投入，回报周期不确定");
      costs.push("机会成本：放弃其他可能的路径");
      costs.push("心理成本：承受较大的不确定性压力");
      break;

    case "conservative":
      costs.push("时间：等待期间的时间消耗");
      costs.push("机会成本：可能错过最佳窗口期");
      costs.push("心理成本：持续的不确定感和焦虑");
      break;

    case "hedge":
      costs.push("精力：需要同时维护多条路径，可能分散注意力");
      costs.push("资金：可能需要双重投入");
      costs.push("效率损失：无法全力投入任一方向");
      break;

    case "exit":
      costs.push("沉没成本：之前的投入可能无法回收");
      costs.push("心理成本：需要接受'失败'或'放弃'的标签");
      costs.push("重建成本：在新方向重新开始的投入");
      break;
  }

  return costs.join("；");
}

/**
 * 生成触发点
 */
function generateTriggerPoints(
  config: typeof STRATEGY_CONFIGS[0],
  variables: VariablesAndConstraints
): string[] {
  const triggers: string[] = [];

  switch (config.type) {
    case "aggressive":
      triggers.push("关键资源和条件已到位");
      triggers.push("外部环境出现有利窗口");
      triggers.push("继续等待的成本开始超过行动风险");
      break;

    case "conservative":
      triggers.push("获得更多关键信息");
      triggers.push("不确定性显著降低");
      triggers.push("出现明确的正面或负面信号");
      if (variables.uncertainties.includes("政策变化")) {
        triggers.push("政策环境明朗化");
      }
      break;

    case "hedge":
      triggers.push("设定明确的时间节点进行评估");
      triggers.push("任一路径出现决定性进展");
      triggers.push("资源消耗达到预设阈值");
      break;

    case "exit":
      triggers.push("核心假设被证伪");
      triggers.push("成本超出预设止损线");
      triggers.push("出现更优的替代选项");
      triggers.push("个人状况发生重大变化");
      break;
  }

  return triggers;
}

/**
 * 生成最坏情况描述
 */
function generateWorstCase(
  config: typeof STRATEGY_CONFIGS[0],
  constraints: string[]
): string {
  switch (config.type) {
    case "aggressive":
      return "全力投入后失败，损失大量时间、资金和机会成本，且难以回到原点。可能需要承受较长的恢复期。";

    case "conservative":
      return "等待期间窗口关闭，最佳时机永久错过。或者环境恶化，后续行动成本大幅上升。";

    case "hedge":
      return "两边都未能取得实质进展，资源分散导致竞争力不足。最终可能两边都失去机会。";

    case "exit":
      return "放弃后原方向意外变好，产生强烈后悔。或者新方向也不如预期，陷入'草地更绿'的循环。";
  }
}

/**
 * 生成策略空间
 */
export function generateStrategies(
  reframedProblem: ReframedProblem,
  variables: VariablesAndConstraints
): StrategySpace {
  const strategies: Strategy[] = STRATEGY_CONFIGS.map((config) => ({
    id: config.id,
    name: `策略 ${config.id}：${config.nameTemplate}`,
    type: config.type,
    typeLabel: config.typeLabel,
    preconditions: generatePreconditions(config, variables),
    executionCost: generateExecutionCost(config, variables),
    triggerPoints: generateTriggerPoints(config, variables),
    worstCase: generateWorstCase(config, variables.hardConstraints),
  }));

  return { strategies };
}
