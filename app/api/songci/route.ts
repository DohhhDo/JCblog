import { NextResponse } from 'next/server'

// 宋词数据直接嵌入到API中，避免文件读取的复杂性
const songciData = [
  "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。",
  "三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。",
  "满地黄花堆积，憔悴损，如今有谁堪摘？守着窗儿，独自怎生得黑？",
  "梧桐更兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！",
  "薄雾浓云愁永昼，瑞脑销金兽。佳节又重阳，玉枕纱厨，半夜凉初透。",
  "东篱把酒黄昏后，有暗香盈袖。莫道不销魂，帘卷西风，人比黄花瘦。",
  "红藕香残玉簟秋，轻解罗裳，独上兰舟。云中谁寄锦书来？雁字回时，月满西楼。",
  "花自飘零水自流，一种相思，两处闲愁。此情无计可消除，才下眉头，却上心头。",
  "昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。",
  "知否，知否？应是绿肥红瘦。"
]

export function GET(request: Request) {
  try {
    // 从URL参数中获取随机种子，如果没有则使用时间戳
    const url = new URL(request.url)
    const seed = url.searchParams.get('seed') || Date.now().toString()
    
    // 使用种子生成随机索引
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    
    const randomIndex = Math.abs(hash) % songciData.length
    const selectedPoem = songciData[randomIndex]
    
    return NextResponse.json({
      poem: selectedPoem,
      success: true,
      seed: seed,
      index: randomIndex
    })
    
  } catch (error) {
    console.error('获取宋词失败:', error)
    return NextResponse.json({ error: '获取宋词失败' }, { status: 500 })
  }
}
