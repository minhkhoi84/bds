import { Toast } from "bootstrap";
import { escapeHtml as esc } from "./format";

interface ToastAction {
  label: string;
  onClick: () => void;
}

// Có action (VD nút "Thử lại") thì toast không tự ẩn, bấm action sẽ đóng toast
export function showToast(message: string, action?: ToastAction): void {
  let box = document.querySelector<HTMLElement>("#toast-container");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-container";
    box.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  el.className = "toast align-items-center text-bg-dark border-0";
  el.setAttribute("role", action ? "alert" : "status");
  el.innerHTML = `<div class="d-flex align-items-center">
    <div class="toast-body">${esc(message)}</div>
    ${action ? `<button type="button" class="btn btn-light btn-sm ms-auto js-toast-action">${esc(action.label)}</button>` : ""}
    <button type="button" class="btn-close btn-close-white me-2 ${action ? "ms-2" : "m-auto"}" data-bs-dismiss="toast" aria-label="Đóng"></button>
  </div>`;
  box.appendChild(el);
  el.addEventListener("hidden.bs.toast", () => el.remove());
  const toast = new Toast(el, action ? { autohide: false } : { delay: 2000 });
  el.querySelector(".js-toast-action")?.addEventListener("click", () => {
    toast.hide();
    action?.onClick();
  });
  toast.show();
}
