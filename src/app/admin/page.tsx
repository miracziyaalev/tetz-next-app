import React, { Suspense } from "react";
import ViewModel from "./viewModel";

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <ViewModel />
        </Suspense>
    );
} 