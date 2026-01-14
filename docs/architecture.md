# Boundary MCP 架构设计

## 项目结构

```
src/
├── index.ts                 # MCP 服务器入口
├── types/                   # 类型定义
│   └── index.ts             # 统一导出所有类型
├── analyzers/               # 核心分析模块
│   ├── index.ts             # 分析器统一导出
│   ├── reframe.ts           # 问题去情绪化重述
│   ├── variables.ts         # 关键变量与约束识别
│   ├── strategies.ts        # 策略空间生成
│   ├── risk.ts              # 风险与回报分布分析
│   └── bias.ts              # 认知偏差与幻觉提示
├── prompts/                 # 提示词模板
│   └── index.ts             # 各模块提示词
└── tools/                   # MCP 工具定义
    └── analyze-decision.ts  # 主分析工具
```

---

## 模块职责

### 1. 类型系统 (`types/`)

定义整个系统的数据结构：

```typescript
// 分析输入
interface DecisionInput {
  problemText: string;        // 用户原始问题描述
}

// 问题重述结果
interface ReframedProblem {
  original: string;           // 原始问题
  reframed: string;           // 去情绪化后的问题
  emotionalElements: string[]; // 识别出的情绪化元素
}

// 变量与约束
interface VariablesAndConstraints {
  goals: string[];            // 目标（用户真正关心的指标）
  keyVariables: string[];     // 关键变量（可变化因素）
  hardConstraints: string[];  // 硬约束（不可忽视的现实限制）
  uncertainties: string[];    // 不确定性来源
}

// 单个策略
interface Strategy {
  id: string;                 // 策略标识 (A, B, C, D)
  name: string;               // 策略名称
  type: string;               // 策略类型（激进/观望/对冲/止损）
  preconditions: string[];    // 前提条件
  executionCost: string;      // 执行成本
  triggerPoints: string[];    // 触发点
  worstCase: string;          // 最坏情况
}

// 策略空间
interface StrategySpace {
  strategies: Strategy[];
}

// 风险回报分布
interface OutcomeDistribution {
  probability: number;        // 概率 (0-100)
  description: string;        // 结果描述
}

interface RiskRewardAnalysis {
  strategyId: string;
  distributions: OutcomeDistribution[];
}

// 认知偏差
interface CognitiveBias {
  type: string;               // 偏差类型
  description: string;        // 具体描述
  mitigation: string;         // 缓解建议
}

interface BiasWarnings {
  biases: CognitiveBias[];
}

// 完整分析结果
interface DecisionAnalysis {
  reframedProblem: ReframedProblem;
  variablesAndConstraints: VariablesAndConstraints;
  strategySpace: StrategySpace;
  riskRewardAnalysis: RiskRewardAnalysis[];
  biasWarnings: BiasWarnings;
}
```

---

### 2. 分析模块 (`analyzers/`)

#### 2.1 `reframe.ts` - 问题去情绪化重述

**职责**：将用户夹杂情绪、立场、焦虑的问题重述为客观、结构化的问题

**输入**：用户原始问题文本

**输出**：`ReframedProblem`

**处理逻辑**：
1. 识别情绪化词汇（焦虑、恐惧、愤怒等）
2. 识别预设立场和结论
3. 提取核心决策问题
4. 重新表述为中性语言

---

#### 2.2 `variables.ts` - 关键变量与约束识别

**职责**：从问题中提取决策相关的变量、约束和不确定性

**输入**：重述后的问题 + 原始上下文

**输出**：`VariablesAndConstraints`

**处理逻辑**：
1. 识别用户真正关心的目标（长期 vs 短期）
2. 提取可变因素（年龄、技能、资金等）
3. 识别硬性约束（法律、时间、资源）
4. 标记不确定性来源（政策、市场、个人）

---

#### 2.3 `strategies.ts` - 策略空间生成

**职责**：生成多个可选策略路径，避免"只有一个选项"的假问题

**输入**：`ReframedProblem` + `VariablesAndConstraints`

**输出**：`StrategySpace`

**处理逻辑**：
1. 生成至少 4 种不同风格的策略
2. 每种策略包含完整的执行要素
3. 策略类型覆盖：激进、保守、对冲、止损

---

#### 2.4 `risk.ts` - 风险与回报分布分析

**职责**：为每个策略生成概率分布，而非确定性预测

**输入**：`StrategySpace` + `VariablesAndConstraints`

**输出**：`RiskRewardAnalysis[]`

**处理逻辑**：
1. 不输出"成功/失败"二元结论
2. 生成概率区间和可能结果
3. 考虑不确定性因素的影响

---

#### 2.5 `bias.ts` - 认知偏差与幻觉提示

**职责**：主动识别用户可能存在的认知偏差

**输入**：原始问题 + 分析上下文

**输出**：`BiasWarnings`

**处理逻辑**：
1. 检测幸存者偏差（个案推全局）
2. 检测叙事驱动（故事代替数据）
3. 检测群体压力（跟风决策）
4. 检测时间偏差（过度关注短期）

---

### 3. 提示词模板 (`prompts/`)

为每个分析模块提供结构化的 Prompt 模板：

```typescript
export const PROMPTS = {
  reframe: `...`,      // 问题重述提示词
  variables: `...`,    // 变量识别提示词
  strategies: `...`,   // 策略生成提示词
  risk: `...`,         // 风险分析提示词
  bias: `...`,         // 偏差检测提示词
};
```

---

### 4. MCP 工具 (`tools/`)

#### `analyze_decision`

**描述**：对现实问题进行结构化策略分析

**参数**：
- `problem_text` (string, required): 用户描述的决策问题

**返回**：完整的 `DecisionAnalysis` 结构

---

## 设计原则实现

| PRD 原则 | 技术实现 |
|----------|----------|
| 不做决定，只暴露结构 | 输出多策略而非单一建议 |
| 不给答案，只给边界 | 输出约束和变量，不输出结论 |
| 不预测未来，只给分布 | 使用概率区间而非确定性预测 |
| 不迎合情绪，只校正幻觉 | 主动检测并提示认知偏差 |

---

## 数据流

```
用户输入
    │
    ▼
┌─────────────────┐
│  问题去情绪化    │ ──► ReframedProblem
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  变量约束识别    │ ──► VariablesAndConstraints
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  策略空间生成    │ ──► StrategySpace
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  风险分布分析    │ ──► RiskRewardAnalysis[]
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  认知偏差检测    │ ──► BiasWarnings
└─────────────────┘
    │
    ▼
  完整分析结果 (DecisionAnalysis)
```
