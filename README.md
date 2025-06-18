# TETZ - Türkiye Eğitim Teknolojileri Zirvesi

## 📋 Proje Hakkında

TETZ (Türkiye Eğitim Teknolojileri Zirvesi) Katılımcı Bilgi Sistemi, Next.js 14 App Router kullanılarak geliştirilmiş modern bir web uygulamasıdır.

## 🏗️ Mimari Yapı

Bu proje, **MVVM (Model-View-ViewModel)** mimarisine dayalı modern bir yapı kullanmaktadır. Kod organizasyonu ve sürdürülebilirlik için aşağıdaki prensiplere uyulmuştur:

### 📁 Klasör Yapısı

```
src/
├── app/
│   ├── user-search/           # Kullanıcı arama sayfası
│   │   ├── viewModel.tsx      # Business logic ve state yönetimi
│   │   ├── view.tsx           # Ana UI bileşeni
│   │   └── widgets/           # Yeniden kullanılabilir UI bileşenleri
│   │       ├── SearchForm.tsx
│   │       ├── HelpBox.tsx
│   │       ├── NotFound.tsx
│   │       └── EmptyState.tsx
│   ├── api/                   # API route'ları
│   └── page.tsx               # Ana sayfa (sadece ViewModel'i çağırır)
├── components/                # Global bileşenler
│   ├── UserCard.tsx
│   └── BadgeCard.tsx
└── styles/                    # Global stiller
```

### 🎯 Mimari Prensipleri

#### 1. **Separation of Concerns (Sorumlulukların Ayrılması)**
- **ViewModel**: Tüm business logic, state yönetimi ve API çağrıları
- **View**: Sadece UI render etme, props ile veri alır
- **Widgets**: Küçük, bağımsız UI bileşenleri

#### 2. **Single Responsibility Principle (Tek Sorumluluk Prensibi)**
- Her dosya tek bir sorumluluğa sahip
- Widget'lar sadece belirli bir UI parçasını render eder
- ViewModel sadece business logic'i yönetir

#### 3. **Reusability (Yeniden Kullanılabilirlik)**
- Widget'lar bağımsız ve farklı sayfalarda kullanılabilir
- ViewModel'ler farklı View'larda kullanılabilir

#### 4. **Testability (Test Edilebilirlik)**
- Her bileşen ayrı ayrı test edilebilir
- Business logic UI'dan ayrı olduğu için unit test yazımı kolay

## 🚀 Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **PDF Generation**: html2pdf.js
- **QR Code**: qrcode.react

## 📝 Kod Yazım Kuralları

### 1. **Dosya İsimlendirme**
- **ViewModel**: `viewModel.tsx` (camelCase)
- **View**: `view.tsx` (camelCase)
- **Widgets**: `PascalCase.tsx` (örn: `SearchForm.tsx`)

### 2. **Component Yapısı**
```typescript
// viewModel.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import ViewComponent from "./view";

export interface DataType {
  // Type definitions
}

const ViewModel = () => {
  // State management
  // Business logic
  // API calls
  
  return <ViewComponent {...props} />;
};

export default ViewModel;
```

```typescript
// view.tsx
import React from "react";
import { DataType } from "./viewModel";
import WidgetComponent from "./widgets/WidgetComponent";

interface ViewProps {
  // Props interface
}

const View: React.FC<ViewProps> = (props) => {
  return (
    <div>
      <WidgetComponent {...widgetProps} />
    </div>
  );
};

export default View;
```

### 3. **Props Yönetimi**
- ViewModel'den View'a tüm state ve fonksiyonlar props ile aktarılır
- Widget'lara sadece gerekli props gönderilir
- TypeScript interface'leri kullanılır

### 4. **State Management**
- Local state için React Hooks kullanılır
- Global state gerektiğinde Context API veya Zustand kullanılabilir
- State'ler ViewModel'de yönetilir

## 🔧 Geliştirme Kuralları

### Yeni Sayfa Ekleme
1. `src/app/[sayfa-adi]/` klasörü oluştur
2. `viewModel.tsx` - Business logic
3. `view.tsx` - UI yapısı
4. `widgets/` - Gerekli widget'lar
5. `page.tsx`'de ViewModel'i import et

### Widget Oluşturma
1. `widgets/` klasöründe `PascalCase.tsx` dosyası oluştur
2. Props interface'i tanımla
3. Sadece UI logic'i içer, business logic olmasın
4. Yeniden kullanılabilir olacak şekilde tasarla

### API Entegrasyonu
1. API çağrıları sadece ViewModel'de yapılır
2. Error handling ViewModel'de yönetilir
3. Loading state'leri ViewModel'de tutulur

## 🎨 UI/UX Prensipleri

### Tasarım Sistemi
- **Renkler**: TETZ brand renkleri (`#0066cc`, `#004b96`)
- **Typography**: Sistem fontları
- **Spacing**: Tailwind CSS spacing scale
- **Components**: Tutarlı component library

### Responsive Design
- Mobile-first yaklaşım
- Tailwind CSS breakpoint'leri kullan
- Flexbox ve Grid layout'ları tercih et

## 🧪 Test Stratejisi

### Unit Tests
- ViewModel'ler için business logic testleri
- Widget'lar için UI testleri
- Jest ve React Testing Library kullan

### Integration Tests
- Sayfa seviyesinde testler
- API entegrasyon testleri

## 📦 Build ve Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
# .env.local
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

## 🤝 Katkıda Bulunma

1. Bu mimari yapıya uygun geliştirme yapın
2. TypeScript kullanın
3. Component'leri widget'lara bölün
4. Business logic'i ViewModel'de tutun
5. Test yazın

## 📄 Lisans

Bu proje TETZ organizasyonu için geliştirilmiştir. Tüm hakları saklıdır.

---

**Not**: Bu mimari, büyük ölçekli React uygulamaları için tasarlanmıştır ve kod kalitesi, sürdürülebilirlik ve performans odaklıdır.
