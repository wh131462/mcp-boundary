#!/usr/bin/env node

/**
 * Boundary MCP - 决策思考引擎
 *
 * 设计原则：
 * - 不做决定，只暴露结构
 * - 不给答案，只给边界
 * - 不预测未来，只给分布
 * - 不迎合情绪，只校正幻觉
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { analyzeDecision, formatAnalysisResult } from "./tools/analyze-decision.js";

// 创建 MCP 服务器实例
const server = new McpServer({
  name: "boundary-mcp",
  version: "1.0.0",
});

// 注册 analyze_decision 工具
server.tool(
  "analyze_decision",
  `对现实问题进行结构化策略分析。

这是一个"暴露现实结构"的决策思考引擎，而不是建议生成器。

功能：
1. 问题去情绪化重述 - 将模糊、情绪化的问题转化为客观、结构化的决策问题
2. 关键变量与约束识别 - 识别目标、关键变量、硬约束和不确定性来源
3. 策略空间生成 - 生成多个可选策略路径（激进、保守、对冲、止损）
4. 风险与回报分布分析 - 为每个策略生成概率分布，而非确定性预测
5. 认知偏差与幻觉提示 - 识别可能影响决策的认知偏差

注意：本工具不会告诉你"该不该做"，只会帮助你看清决策的结构和边界。`,
  {
    problem_text: z
      .string()
      .min(10, "问题描述至少需要10个字符")
      .describe("用户描述的决策问题，可以包含情绪、立场、焦虑等自然表达"),
  },
  async ({ problem_text }) => {
    try {
      // 执行分析
      const analysis = analyzeDecision(problem_text);

      // 格式化为可读文本
      const formattedResult = formatAnalysisResult(analysis);

      return {
        content: [
          {
            type: "text",
            text: formattedResult,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return {
        content: [
          {
            type: "text",
            text: `分析过程中发生错误: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// 注册 get_analysis_json 工具 - 返回结构化 JSON 数据
server.tool(
  "get_analysis_json",
  `获取决策分析的原始 JSON 数据结构。

与 analyze_decision 功能相同，但返回结构化的 JSON 数据而非格式化文本。
适用于需要程序化处理分析结果的场景。`,
  {
    problem_text: z
      .string()
      .min(10, "问题描述至少需要10个字符")
      .describe("用户描述的决策问题"),
  },
  async ({ problem_text }) => {
    try {
      const analysis = analyzeDecision(problem_text);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: errorMessage }),
          },
        ],
        isError: true,
      };
    }
  }
);

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Boundary MCP server started");
}

main().catch(console.error);
