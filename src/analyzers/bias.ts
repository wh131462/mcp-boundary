/**
 * 认知偏差与幻觉提示分析器
 */

import type {
  BiasWarnings,
  CognitiveBias,
  BiasType,
  ReframedProblem,
} from "../types/index.js";

/** 偏差检测规则 */
interface BiasRule {
  type: BiasType;
  typeLabel: string;
  patterns: RegExp[];
  description: string;
  mitigation: string;
}

/** 偏差检测规则集 */
const BIAS_RULES: BiasRule[] = [
  {
    type: "survivorship",
    typeLabel: "幸存者偏差",
    patterns: [
      /别人.*成功/,
      /有人.*做到/,
      /朋友.*实现/,
      /看到.*案例/,
      /成功.*例子/,
      /XXX都能/,
      /人家都/,
    ],
    description: "可能将个别成功案例误认为普遍路径，忽视了大量未能成功的案例",
    mitigation: "建议：主动寻找失败案例，了解失败的原因和概率。关注基础率而非个案。",
  },
  {
    type: "narrative",
    typeLabel: "叙事谬误",
    patterns: [
      /听说/,
      /据说/,
      /有个故事/,
      /看了.*文章/,
      /网上说/,
      /大V说/,
      /博主/,
      /up主/,
    ],
    description: "可能被故事和叙事影响决策，而非基于数据和系统性分析",
    mitigation: "建议：区分故事和数据，寻找系统性的统计信息。警惕情绪化的成功学叙事。",
  },
  {
    type: "groupPressure",
    typeLabel: "群体压力",
    patterns: [
      /大家都/,
      /别人都/,
      /身边.*都/,
      /朋友都/,
      /同事都/,
      /同龄人/,
      /周围.*人/,
      /趋势/,
      /风口/,
    ],
    description: "可能因为'大家都这样做'而产生跟风冲动，忽视了个人条件的差异性",
    mitigation: "建议：明确自己的独特条件和目标，不同人适合不同路径。避免为了'不落后'而盲目跟风。",
  },
  {
    type: "shortTermFocus",
    typeLabel: "短期聚焦偏差",
    patterns: [
      /马上/,
      /立刻/,
      /赶紧/,
      /来不及/,
      /错过/,
      /最后.*机会/,
      /窗口.*关闭/,
      /再不.*就/,
    ],
    description: "可能过度关注短期结果和紧迫感，而忽视长期结构性因素",
    mitigation: "建议：拉长时间维度思考，区分'真紧迫'和'假紧迫'。多数人生决策的影响是长期的。",
  },
  {
    type: "confirmationBias",
    typeLabel: "确认偏差",
    patterns: [
      /我觉得.*应该/,
      /我认为.*对/,
      /明显.*更好/,
      /肯定是/,
      /毫无疑问/,
      /怎么看都/,
    ],
    description: "可能只关注支持已有观点的信息，忽视或贬低相反的证据",
    mitigation: "建议：主动寻找反对意见，尝试论证相反立场。问自己：'什么情况下我会改变想法？'",
  },
  {
    type: "anchoringBias",
    typeLabel: "锚定效应",
    patterns: [
      /一开始/,
      /最初/,
      /第一.*想法/,
      /本来以为/,
      /原本.*计划/,
    ],
    description: "可能过度依赖最初获得的信息或第一印象，难以根据新信息调整判断",
    mitigation: "建议：定期重新评估假设，考虑如果从零开始会怎么选择。避免被沉没成本影响。",
  },
  {
    type: "sunkCostFallacy",
    typeLabel: "沉没成本谬误",
    patterns: [
      /已经.*投入/,
      /花了.*时间/,
      /付出.*努力/,
      /不能.*白费/,
      /坚持.*这么久/,
      /放弃.*可惜/,
    ],
    description: "可能因为已经投入的成本而坚持错误方向，无法理性止损",
    mitigation: "建议：关注未来的成本和收益，而非过去的投入。问自己：'如果重新选择，还会这样做吗？'",
  },
];

/** 情绪化元素对应的偏差映射 */
const EMOTIONAL_BIAS_MAP: Record<string, BiasType> = {
  "群体压力": "groupPressure",
  "紧迫感假设": "shortTermFocus",
  "竞争焦虑": "groupPressure",
  "预设结论": "confirmationBias",
  "预设偏好": "confirmationBias",
};

/**
 * 检测文本中的认知偏差
 */
function detectBiasesFromText(text: string): CognitiveBias[] {
  const biases: CognitiveBias[] = [];
  const detectedTypes = new Set<BiasType>();

  for (const rule of BIAS_RULES) {
    if (detectedTypes.has(rule.type)) continue;

    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        detectedTypes.add(rule.type);
        biases.push({
          type: rule.type,
          typeLabel: rule.typeLabel,
          description: rule.description,
          mitigation: rule.mitigation,
        });
        break;
      }
    }
  }

  return biases;
}

/**
 * 从情绪化元素推断可能的偏差
 */
function inferBiasesFromEmotions(emotionalElements: string[]): CognitiveBias[] {
  const biases: CognitiveBias[] = [];
  const detectedTypes = new Set<BiasType>();

  for (const element of emotionalElements) {
    for (const [keyword, biasType] of Object.entries(EMOTIONAL_BIAS_MAP)) {
      if (element.includes(keyword) && !detectedTypes.has(biasType)) {
        detectedTypes.add(biasType);
        const rule = BIAS_RULES.find((r) => r.type === biasType);
        if (rule) {
          biases.push({
            type: rule.type,
            typeLabel: rule.typeLabel,
            description: `从表述中检测到：${element}`,
            mitigation: rule.mitigation,
          });
        }
      }
    }
  }

  return biases;
}

/**
 * 分析认知偏差
 */
export function analyzeBias(reframedProblem: ReframedProblem): BiasWarnings {
  const textBiases = detectBiasesFromText(reframedProblem.original);
  const emotionBiases = inferBiasesFromEmotions(reframedProblem.emotionalElements);

  // 合并并去重
  const allBiases = [...textBiases];
  const detectedTypes = new Set(textBiases.map((b) => b.type));

  for (const bias of emotionBiases) {
    if (!detectedTypes.has(bias.type)) {
      allBiases.push(bias);
      detectedTypes.add(bias.type);
    }
  }

  // 如果没有检测到任何偏差，添加通用提醒
  if (allBiases.length === 0) {
    allBiases.push({
      type: "other",
      typeLabel: "通用提醒",
      description: "未检测到明显的认知偏差，但请保持警惕",
      mitigation: "建议：定期反思自己的假设和推理过程，寻求不同视角的意见。",
    });
  }

  return { biases: allBiases };
}
