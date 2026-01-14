#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建 MCP 服务器实例
const server = new McpServer({
  name: "mcp-custom",
  version: "1.0.0",
});

// 注册 hello 工具
server.tool(
  "hello",
  "Say hello to someone",
  {
    name: z.string().describe("The name to greet"),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}! Welcome to MCP!`,
        },
      ],
    };
  }
);

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server started");
}

main().catch(console.error);
