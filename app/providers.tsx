"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import QuickViewModal from "./components/ui/QuickViewModal";
import CartDrawer from "./components/ui/CartDrawer";
import CartInitializer from "./components/providers/CartInitializer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartInitializer />
      {children}
      <QuickViewModal />
      <CartDrawer />
    </Provider>
  );
}
