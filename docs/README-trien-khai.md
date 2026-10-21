# Haustek — Hướng dẫn triển khai

Cập nhật: 29.07.2026 · Website: **haustek-group.com** · Liên hệ: **mgmt@haustek-group.com**

---

## 1. Toàn bộ file và vai trò của từng file

### Trang web (upload lên thư mục gốc của hosting)

| File | Nội dung |
|---|---|
| `index.html` | Trang chủ |
| `events.html` | Trang sự kiện: đầu bảng quốc tế, lưu trữ 249 đêm, video các set. **Bảng dữ liệu nằm ở đầu phần script** |
| `assets/` | Hệ giao diện dùng chung cho mọi trang: `site.css` (màu, chữ, nav, chân trang, nút), `site.js` (menu điện thoại, đổi VI/EN, hiện dần khi cuộn, số chạy, poster nghiêng, sân khấu 3D kéo để xoay), `field.js` (trường sóng âm 3D bằng WebGL ở đầu trang chủ, Sự kiện, Pháp lý và trang 404), `wordmark.svg` (logo) |
| `artists.html` | Trang nghệ sĩ, dạng lưới card. **Bảng dữ liệu nằm ngay đầu phần script trong file** |
| `artists/` | Thư mục ảnh nghệ sĩ, định dạng `.webp` vuông 800×800 |
| `vercel.json` | Cấu hình cho Vercel: bỏ đuôi `.html`, cache ảnh, header bảo mật |
| `legal.html` | 4 mục pháp lý: điều khoản, quyền riêng tư, cookie, khả năng tiếp cận |
| `404.html` | Trang báo không tìm thấy |

### Ảnh và biểu tượng (cùng thư mục gốc, **không** bỏ vào thư mục con)

| File | Dùng ở đâu |
|---|---|
| `og-image.jpg` | Ảnh hiện ra khi share link lên Facebook, Zalo, X, Telegram |
| `og-image.png` | Bản chất lượng cao, dùng khi cần in hoặc chỉnh sửa lại |
| `favicon.svg` | Biểu tượng chính cho trình duyệt hiện đại |
| `favicon.ico` | Dự phòng cho trình duyệt cũ |
| `favicon-16x16.png` … `favicon-512x512.png` | Các cỡ cho tab trình duyệt và Android |
| `apple-touch-icon.png` | Biểu tượng khi lưu trang vào màn hình chính iPhone/iPad |
| `site.webmanifest` | Cho phép cài website như một ứng dụng trên điện thoại |
| `logo-white.png` | Logo wordmark nền trong, dùng cho thiết kế khác |

### Cho công cụ tìm kiếm

| File | Nội dung |
|---|---|
| `robots.txt` | Cho phép Google lập chỉ mục toàn bộ trang |
| `sitemap.xml` | Danh sách trang để Google tìm nhanh hơn |

### Không upload lên web — dùng ở nơi khác

| File | Dùng ở đâu |
|---|---|
| `google-apps-script.js` | **Tạm không dùng** — viết cho trang khai báo metadata, trang này đã gỡ khỏi website (10.2026). Giữ lại phòng khi bật lại |
| `supabase-schema.sql` | Dán vào Supabase SQL Editor để dựng cơ sở dữ liệu doanh thu |
| `haustek-brand-playbook.html` | Tài liệu nội bộ về nhận diện thương hiệu. Mở bằng trình duyệt, in ra PDF được |

---

## 2. Đưa website lên mạng

### Link không có đuôi .html

Trong bộ file có sẵn `vercel.json`. Chỉ cần để nó ở thư mục gốc cùng các file
HTML là Vercel tự bỏ đuôi `.html` khỏi mọi đường dẫn:

| Trước | Sau |
|---|---|
| `/artists.html` | `/artists` |
| `/legal.html` | `/legal` |

Ai vào bằng link cũ có đuôi `.html` vẫn tới đúng nơi, Vercel tự chuyển hướng.
File này cũng đặt sẵn vài đường dẫn tiếng Việt cho dễ đọc khi in lên card hay
poster: `/nghe-si`, `/su-kien`. Các link cũ `/metadata`, `/submit`, `/gui-nhac` giờ
chuyển tới mục Liên hệ trên trang chủ (chuyển hướng tạm thời, để sau này bật lại
trang metadata thì trình duyệt không bị nhớ cứng).

Nếu bạn đổi sang **Cloudflare Pages**, không cần `vercel.json` — Cloudflare bỏ
đuôi `.html` mặc định. Còn **Netlify** thì tạo một file tên `netlify.toml` với
nội dung:

```toml
[[redirects]]
  from = "/*.html"
  to = "/:splat"
  status = 301
```

### Cách đơn giản nhất: Cloudflare Pages (miễn phí)

1. Tạo một thư mục trên máy, bỏ tất cả file ở nhóm "Trang web", "Ảnh và biểu tượng", "Cho công cụ tìm kiếm" vào đó
2. Vào `dash.cloudflare.com` → Workers & Pages → Create → Pages → Upload assets
3. Kéo cả thư mục vào, bấm Deploy
4. Vào tab Custom domains, thêm `haustek-group.com`
5. Trang 404 hoạt động tự động vì Cloudflare nhận diện file tên `404.html`

Netlify và Vercel làm y hệt, cũng miễn phí. Nếu dùng hosting truyền thống có cPanel thì upload qua FTP vào thư mục `public_html`.

### Kiểm tra sau khi lên

- [ ] Mở `haustek-group.com` — trang chủ hiện đúng
- [ ] Biểu tượng nhỏ hiện ở tab trình duyệt
- [ ] Mở `haustek-group.com/mot-duong-dan-bay-ba` — phải ra trang 404, không phải lỗi của hosting
- [ ] Mở `/artists` (không có `.html`) — phải ra trang nghệ sĩ
- [ ] Ảnh 13 nghệ sĩ hiện đủ, không ai bị ô trống
- [ ] Bấm nút "Liên hệ" trên đầu trang → cuộn tới mục Liên hệ; ba ô Gửi demo / Phát hành / Booking mở email có sẵn tiêu đề
- [ ] Bốn link pháp lý dưới chân trang → sang được `legal.html` đúng mục
- [ ] Chuyển VI/EN ở góc trên phải → toàn trang đổi ngôn ngữ
- [ ] Mở trên điện thoại, cuộn thử xem có mượt không
- [ ] Dán link vào Facebook Debugger (`developers.facebook.com/tools/debug`) → phải thấy ảnh OG. Nếu chưa thấy, bấm "Scrape Again"
- [ ] Gửi `sitemap.xml` cho Google qua Google Search Console

---

## 3. Nối form metadata với Google Sheets

> **Hiện không áp dụng.** Trang khai báo metadata đã gỡ khỏi website (10.2026) —
> nghệ sĩ gửi demo và hồ sơ phát hành qua email. Mục này giữ lại phòng khi cần bật
> lại: lấy `metadata.html` từ lịch sử git, bỏ ba dòng chuyển hướng trong `vercel.json`.

Mở `google-apps-script.js`, phần đầu file có hướng dẫn chi tiết từng bước. Tóm tắt:

1. Tạo Google Sheet mới, copy ID trên thanh địa chỉ
2. Trong Sheet: Tiện ích mở rộng → Apps Script → dán toàn bộ nội dung file
3. Sửa 2 dòng `SHEET_ID` và `NOTIFY_EMAIL`
4. Deploy dạng Web app, quyền truy cập chọn **Anyone**
5. Copy URL nhận được, mở `metadata.html`, tìm dòng `const ENDPOINT = "";` và dán vào

Sau đó mỗi hồ sơ nghệ sĩ gửi sẽ tự động vào 3 tab: `Releases`, `Tracks`, `Splits`, và bạn nhận email báo.

**Chưa làm bước này thì form vẫn dùng được** — nó sẽ tải file JSON + CSV về máy nghệ sĩ để họ gửi email.

---

## 4. Dựng cơ sở dữ liệu doanh thu

1. Tạo project trên `supabase.com`
2. Vào SQL Editor → New query → dán toàn bộ `supabase-schema.sql` → Run
3. Chạy 2 câu kiểm tra ở phần 11 của file SQL để xác nhận phân quyền đã bật

**Chống project tự ngủ:** gói miễn phí tạm dừng sau 7 ngày không ai truy cập. Vào `cron-job.org`, tạo một job gọi vào REST endpoint của Supabase mỗi 2–3 ngày là xong. Dữ liệu không bao giờ mất, project chỉ ngủ thôi, nhưng để nghệ sĩ gặp lỗi thì không hay.

**Trước khi mở đăng nhập cho nghệ sĩ:** phải gắn SMTP riêng (Resend hoặc Brevo, đều có gói miễn phí). SMTP mặc định của Supabase chỉ gửi được 3–4 email mỗi giờ, đủ để thử chứ không đủ để dùng thật.

---

## 5. Điền dữ liệu cho trang nghệ sĩ

Mở `artists.html`, tìm khối `const ARTISTS = [` ở đầu phần script. Mỗi nghệ sĩ một dòng:

```js
{ name:"Tri Minh", role:"producer", photo:"artists/tri-minh.jpg",
  track:"Đêm Thành Phố", url:"https://open.spotify.com/track/...", streams:3200000 },
```

Giải thích các trường:

| Trường | Ghi gì |
|---|---|
| `name` | Tên hiển thị |
| `role` | Dùng đúng từ khoá để bộ lọc chạy: `producer` `dj` `vocalist` `band` `songwriter` `vj`. Nhiều vai trò thì cách nhau bằng dấu cách |
| `photo` | Đường dẫn ảnh, ví dụ `artists/ten-nghe-si.jpg`. **Để trống cũng được** — card tự chuyển sang khối chữ viết tắt trên nền sóng |
| `track` | Tên bài tiêu biểu |
| `url` | Link Spotify của bài đó |
| `streams` | Số lượt nghe, ghi **số thuần** như `3200000`. Trang tự rút gọn thành `3,2M`. Để `null` nếu chưa có |

Ảnh nghệ sĩ phải **vuông 1:1**, xuất 800×800 và lưu dạng `.webp`, bỏ vào thư mục `artists/`.
Ảnh gốc chụp ra thường 3000×3000 và nặng vài MB — nén xuống webp 800px thì chỉ còn
khoảng 20–100KB mỗi ảnh mà nhìn vẫn nét, tải nhanh hơn rất nhiều trên mạng di động.

Vòng cột 3D ở đầu trang Nghệ sĩ tự lấy 10 người nhiều lượt nghe nhất trong bảng này — sửa bảng là cột tự đổi theo.

**Đừng ghi số ước lượng vào `streams`.** Con số sai trên trang công khai thì nghệ sĩ và đối tác đều nhận ra ngay. Chưa có số thật thì để `null`, card sẽ ghi "Đang cập nhật" — trông đàng hoàng hơn nhiều so với một con số bịa.

---

## 6. Khi có video nền cho trang chủ

Mở `index.html`, tìm dòng gần đầu phần script:

```js
const HERO_VIDEO = { mp4:"", webm:"", poster:"" };
```

Điền tên file vào, ví dụ:

```js
const HERO_VIDEO = { mp4:"hero.mp4", webm:"hero.webm", poster:"hero.jpg" };
```

Yêu cầu video: dài 8–15 giây, cắt sao cho lặp mượt, **không có tiếng** (có tiếng thì trình duyệt chặn tự phát), mỗi file dưới 4MB. Dùng HandBrake để nén. Không có video thì trang dùng nền chuyển động vẽ bằng code, vẫn đẹp.

Code đã tự xử lý: tắt video nếu người dùng bật chế độ giảm chuyển động, không tải nếu mạng chậm hoặc đang bật tiết kiệm dữ liệu, tạm dừng khi cuộn qua khỏi phần đầu trang.

---

## 7. Việc còn lại, xếp theo thứ tự nên làm

1. **Ảnh nghệ sĩ và số liệu stream** — điền vào bảng `ARTISTS` trong `artists.html`. Đây là khoảng trống lớn nhất hiện nay
2. **Đưa web lên và gắn Google Sheets** — hai việc này làm xong là đã dùng thật được
3. **Chạy SQL Supabase** và gắn cron chống ngủ
4. **Giao diện dashboard nghệ sĩ** — đọc từ 4 view đã tạo sẵn trong file SQL
5. **Luật sư rà soát `legal.html`** — nhất là phần chuyển dữ liệu ra nước ngoài theo Nghị định 13/2023/NĐ-CP
6. **Mở lại mục Blog** khi có bài viết
7. **Công cụ đo lượt truy cập** nếu cần — nên chọn loại không dùng cookie như Plausible hoặc Umami, để không phải sửa lại chính sách cookie đã công bố

---

## 8. Vài điều đã cố ý làm, đừng vô tình gỡ

- **Không có cookie theo dõi, không Google Analytics, không pixel quảng cáo.** Chính sách cookie đã công bố điều này. Nếu sau này thêm công cụ đo, phải cập nhật lại `legal.html`
- **Không tự động phát âm thanh.** Beat 124 BPM ở trang chủ chỉ chạy khi bấm nút (rời tab là tự tắt); trình phát Spotify/YouTube chỉ được tải khi bấm nút phát, đóng là gỡ hẳn
- **Đồ hoạ 3D không dùng thư viện ngoài.** `assets/field.js` là WebGL thuần, vài KB, không gọi máy chủ bên thứ ba nào — chính sách quyền riêng tư chỉ kể tên Google Fonts. Máy không có WebGL thì hiện hoạ tiết sóng tĩnh; vòng xoay nghệ sĩ và quả cầu cửa hàng là CSS 3D, tắt JS thì thành lưới ảnh / danh sách bình thường
- **Ảnh trong vòng xoay trang chủ** lấy 12 nghệ sĩ nhiều lượt nghe nhất trong bảng `ARTISTS` của `artists.html` — đổi bảng thì nhớ đổi cả trang chủ
- **6 thẻ "Kết quả" ở trang chủ** ghi tay từ số liệu thật (lượt nghe trong `ARTISTS`, đêm cháy vé / Boiler Room trong `ARCHIVE` của `events.html`), mỗi thẻ dẫn tới nguồn để khách tự kiểm chứng. Số đổi thì sửa cả HTML lẫn bảng `I18N` của `index.html` (khoá `c1n`…`c6m`)
- **Trang Sự kiện:** đường hầm 3D dựng từ 12 poster trong khối `#headliners` (xếp từ mới tới cũ — thêm poster thì giữ đúng thứ tự ngày); ba dự án là bảng `SET_GROUPS` (mỗi nhóm có `year`, `stats` và danh sách set; tên và dòng mô tả nằm trong `I18N` với khoá `grp_…`, `sub_…`); cột 3D theo năm tự đếm từ `ARCHIVE`
- **Chiều cao cột lượt nghe ở trang Nghệ sĩ theo căn bậc hai** cho cột nhỏ không chìm hẳn; con số thật luôn ghi trên đầu cột. Cột theo năm ở trang Sự kiện thì theo tỉ lệ thẳng
- **Chữ viết theo mục Giọng nói của brand playbook**: viết như người Việt nói, câu ngắn, cụ thể bằng con số; không trộn nửa câu Việt nửa câu Anh
- **Toàn bộ hiệu ứng tự tắt** khi máy người dùng bật chế độ giảm chuyển động
- **Ngôn ngữ VI/EN nhớ bằng `sessionStorage`, không phải `localStorage`** — chính sách cookie hứa "đóng tab là mất". Đổi sang `localStorage` là phải sửa lại `legal.html`
- **Màu và font lấy đúng theo `haustek-brand-playbook.html`** — nền đêm, chữ giấy, một màu đỏ. Muốn đổi thì sửa biến trong `assets/site.css`, mọi trang ăn theo
- **Logo trên web là SVG vector dò từ chính file logo gốc**, không phải font. Đừng thay bằng chữ đánh máy, sẽ không khớp
