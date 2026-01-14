/**
 * analyze_decision 工具实现
 *
 * 对现实问题进行结构化策略分析
 */

import type { DecisionAnalysis } from "../types/index.js";
import {
  analyzeAndReframe,
  analyzeVariables,
  generateStrategies,
  analyzeRisk,
  analyzeBias,
} from "../analyzers/index.js";

/**
 * 执行完整的决策分析
 */
export function analyzeDecision(problemText: string): DecisionAnalysis {
  // Step 1: 问题去情绪化重述
  const reframedProblem = analyzeAndReframe(problemText);

  // Step 2: 关键变量与约束识别
  const variablesAndConstraints = analyzeVariables(reframedProblem);

  // Step 3: 策略空间生成
  const strategySpace = generateStrategies(reframedProblem, variablesAndConstraints);

  // Step 4: 风险与回报分布分析
  const riskRewardAnalysis = analyzeRisk(strategySpace, variablesAndConstraints);

  // Step 5: 认知偏差与幻觉提示
  const biasWarnings = analyzeBias(reframedProblem);

  return {
    reframedProblem,
    variablesAndConstraints,
    strategySpace,
    riskRewardAnalysis,
    biasWarnings,
  };
}

/**
 * 格式化分析结果为可读文本
 */
export function formatAnalysisResult(analysis: DecisionAnalysis): string {
  const lines: string[] = [];

  // 标题
  lines.push("# 决策结构分析报告");
  lines.push("");

  // 1. 问题重述
  lines.push("## 1. 问题重述");
  lines.push("");
  lines.push("**原始问题：**");
  lines.push(`> ${analysis.reframedProblem.original}`);
  lines.push("");
  lines.push("**重述后的核心问题：**");
  lines.push(`> ${analysis.reframedProblem.reframed}`);
  lines.push("");
  if (analysis.reframedProblem.emotionalElements.length > 0) {
    lines.push("**识别出的情绪化元素：**");
    for (const element of analysis.reframedProblem.emotionalElements) {
      lines.push(`- ${element}`);
    }
    lines.push("");
  }

  // 2. 变量与约束
  lines.push("## 2. 变量与约束");
  lines.push("");
  lines.push("### 目标");
  for (const goal of analysis.variablesAndConstraints.goals) {
    lines.push(`- ${goal}`);
  }
  lines.push("");
  lines.push("### 关键变量");
  for (const variable of analysis.variablesAndConstraints.keyVariables) {
    lines.push(`- ${variable}`);
  }
  lines.push("");
  lines.push("### 硬约束");
  for (const constraint of analysis.variablesAndConstraints.hardConstraints) {
    lines.push(`- ${constraint}`);
  }
  lines.push("");
  lines.push("### 不确定性来源");
  for (const uncertainty of analysis.variablesAndConstraints.uncertainties) {
    lines.push(`- ${uncertainty}`);
  }
  lines.push("");

  // 3. 策略空间
  lines.push("## 3. 策略空间");
  lines.push("");
  for (const strategy of analysis.strategySpace.strategies) {
    lines.push(`### ${strategy.name}（${strategy.typeLabel}）`);
    lines.push("");
    lines.push("**前提条件：**");
    for (const pre of strategy.preconditions) {
      lines.push(`- ${pre}`);
    }
    lines.push("");
    lines.push("**执行成本：**");
    lines.push(`${strategy.executionCost}`);
    lines.push("");
    lines.push("**触发点：**");
    for (const trigger of strategy.triggerPoints) {
      lines.push(`- ${trigger}`);
    }
    lines.push("");
    lines.push("**最坏情况：**");
    lines.push(`${strategy.worstCase}`);
    lines.push("");
  }

  // 4. 风险/回报分布
  lines.push("## 4. 风险与回报分布");
  lines.push("");
  for (const riskAnalysis of analysis.riskRewardAnalysis) {
    lines.push(`### ${riskAnalysis.strategyName}`);
    lines.push("");
    lines.push("```");
    for (const dist of riskAnalysis.distributions) {
      const bar = "█".repeat(Math.floor(dist.probability / 5));
      lines.push(`${dist.probability.toString().padStart(2)}% ${bar} ${dist.description}`);
    }
    lines.push("```");
    lines.push("");
  }

  // 5. 认知偏差提示
  lines.push("## 5. 认知偏差提示");
  lines.push("");
  for (const bias of analysis.biasWarnings.biases) {
    lines.push(`### ⚠️ ${bias.typeLabel}`);
    lines.push("");
    lines.push(`**表现：** ${bias.description}`);
    lines.push("");
    lines.push(`**${bias.mitigation}**`);
    lines.push("");
  }

  // 结尾提醒
  lines.push("---");
  lines.push("");
  lines.push("*本分析旨在暴露决策结构，而非给出答案。最终选择取决于你对自身目标和约束的权衡。*");

  return lines.join("\n");
}
