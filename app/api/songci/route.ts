import { NextResponse } from 'next/server'

import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
  try {
    // 读取本地songci.txt文件
    const filePath = path.join(process.cwd(), 'components', 'songci.txt')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // 按行分割内容
    const lines = content.split('\n').filter(line => line.trim())
    
    // 过滤出包含句号、感叹号或问号的行（这些是宋词内容）
    const poemLines = lines.filter(line => 
      line.includes('。') || line.includes('！') || line.includes('？')
    )
    
    if (poemLines.length === 0) {
      return NextResponse.json({ error: '没有找到宋词内容' }, { status: 404 })
    }
    
    // 随机选择一首宋词（选择连续的几行作为一首完整的词）
    const randomIndex = Math.floor(Math.random() * (poemLines.length - 2))
    const selectedPoem = poemLines.slice(randomIndex, randomIndex + 3).join('\n')
    
    return NextResponse.json({
      poem: selectedPoem,
      success: true
    })
    
  } catch (error) {
    console.error('读取宋词文件失败:', error)
    return NextResponse.json({ error: '读取宋词失败' }, { status: 500 })
  }
}
