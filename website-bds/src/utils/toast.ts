import { Toast } from "bootstrap";

export function showToast(message: string): void {
  let box = document.querySelector<HTMLElement>("#toast-container");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-container";
    box.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  el.className = "toast align-items-center text-bg-dark border-0";
  el.innerHTML = `<div class="d-flex">
    <div class="toast-body">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
  </div>`;
  box.appendChild(el);
  el.addEventListener("hidden.bs.toast", () => el.remove());
  new Toast(el, { delay: 2000 }).show();
}