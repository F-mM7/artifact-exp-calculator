# Artifact Experience Calculator

原神の聖遺物（Artifact）強化に必要な経験値素材の使用量を計算する Web アプリ。

🔗 デモ: https://f-mm7.github.io/artifact-exp-calculator/

## 機能

- レアリティ（★4 / ★5）の切り替え
- 強化済みのサブステータス選択と現在値の入力
- 現在レベル・経験値からの追加強化に必要な経験値素材の自動計算
- 経験値素材ごとのオン / オフ切り替え（Lv1〜Lv4 経験値素材、聖潔オイル、聖潔エッセンス）
- 目標レベル指定（任意のレベル / 4 段階ごとの自動）
- 目標聖遺物の登録（★5 のみ）と将来必要素材の集計
- 経験値容量の分割比率の調整

## 開発

```bash
npm install
npm run dev      # 開発サーバ
npm run build    # ビルド
npm run lint     # ESLint
npm run deploy   # gh-pages へデプロイ
```

## 技術スタック

React 19 / TypeScript / Vite / GitHub Pages
