# Artifact Experience Calculator - React版

## プロジェクト概要
`~/artifact-exp-calculator`の実装内容を全く同じ機能でReact + TypeScript + Viteで再実装し、GitHub Pagesで公開するプロジェクト。

## 元の実装内容分析

### 機能
1. **Substat選択機能**: DEF, Energy_Recharge, CRIT_Rate, CRIT_DMGから選択
2. **強化中アーティファクト情報**: レベル(0-20)と経験値(0-35574)の入力
3. **サブスタット値調整**: 選択したサブスタットの値を+/-ボタンで調整
4. **経験値計算機能**:
   - 必要経験値(exp req)と経験値上限(exp cap)の表示
   - 各種強化素材(lv1-4, unc, ess)の最適な使用量計算
5. **目標アーティファクト管理**:
   - テキストエリアから数値を解析してリストに追加
   - テーブル形式での表示
6. **経験値付与シミュレーション**: x1, x2, x5ボタンでの経験値付与

### 技術仕様
- バニラJavaScript + jQuery
- 累積経験値テーブル: 21レベル分(0-20)
- 強化素材の経験値: lv1(420), lv2(840), lv3(1260), lv4(2520), unc(2500), ess(10000)
- サブスタット最大値: DEF(58.3), Energy_Recharge(51.8), CRIT_Rate(31.1), CRIT_DMG(62.2)
- 最適化アルゴリズム: 全探索による最小コスト計算

## 実装予定

### 技術スタック
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules or Styled Components
- **State Management**: React useState/useReducer
- **Deployment**: GitHub Pages
- **Package Manager**: npm

### コンポーネント設計
1. `App.tsx` - メインコンポーネント
2. `SubstatSelector.tsx` - サブスタット選択UI
3. `ArtifactEnhancer.tsx` - 強化中アーティファクト管理
4. `MaterialCalculator.tsx` - 素材計算・表示
5. `TargetArtifactManager.tsx` - 目標アーティファクト管理
6. `types/` - TypeScript型定義

### 導入予定パッケージ
- `react`, `react-dom`
- `typescript`
- `vite`
- `@types/react`, `@types/react-dom`
- `gh-pages` (デプロイ用)

### デプロイ設定
- GitHub Pagesの設定
- Viteビルド設定の調整
- `gh-pages`ブランチへの自動デプロイ

## 開発手順
1. Vite + React + TypeScriptプロジェクトの初期化
2. 元のロジックをTypeScriptに移植
3. Reactコンポーネントの実装
4. スタイルの適用
5. GitHub Pagesの設定とデプロイ

## 注意事項
- 元の機能を完全に再現すること
- レスポンシブデザインの考慮
- TypeScriptによる型安全性の確保
- パフォーマンスの最適化（元の全探索アルゴリズムの効率化検討）