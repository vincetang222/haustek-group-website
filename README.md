# Haustek — website công khai

Mã nguồn của **haustek-group.com**: trang chủ, Nghệ sĩ, Sự kiện, Pháp lý và trang 404. HTML, CSS và JS tĩnh, không có bước build. CRM và portal nằm ở repo riêng `vincetang222/haustek`.

## Chạy thử ở máy

```bash
npx serve .
```

Mở http://localhost:3000. `serve` tự bỏ đuôi `.html` giống Vercel.

## Sửa số liệu

| Muốn sửa | File |
|---|---|
| Lượt nghe, tên bài, ảnh nghệ sĩ | `assets/artists-data.js` (trang Nghệ sĩ và trang chủ cùng đọc từ đây) |
| Lưu trữ sự kiện, thành phố của địa điểm | bảng `ARCHIVE`, `VENUE_CITY`, `EVENT_CITY` trong `events.html` |
| Chuyển hướng, cache, header bảo mật | `vercel.json` |

Hướng dẫn đầy đủ: [`docs/README-trien-khai.md`](docs/README-trien-khai.md).

## Đưa lên mạng

Vercel, dự án `haustek-website` (vincetang222s-projects), gắn tên miền **haustek-group.com**. Loại **Other**: không có lệnh build, thư mục xuất là gốc repo. Mỗi lần đẩy lên `main` là Vercel tự dựng lại bản production; nhánh khác thì ra bản xem trước.
