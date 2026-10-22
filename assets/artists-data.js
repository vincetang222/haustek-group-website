/* =====================================================================
   HAUSTEK — BẢNG NGHỆ SĨ DÙNG CHUNG
   Một chỗ duy nhất giữ tên, bài tiêu biểu và lượt nghe Spotify. Hai trang
   cùng đọc file này:
     • artists.html  lưới nghệ sĩ, vòng cột 3D top 10, tổng lượt nghe
     • index.html    3 thẻ "Kết quả" về phát hành + vòng xoay 12 nghệ sĩ
   Sửa số ở đây là cả hai trang tự đổi theo — không còn số gõ tay ở chỗ khác
   (trừ bản dự phòng trong HTML trang chủ, chỉ hiện khi máy tắt JS).
   ===================================================================== */

/* =====================================================================
   BẢNG DỮ LIỆU NGHỆ SĨ — CHỖ DUY NHẤT BẠN CẦN SỬA

     name     Tên nghệ sĩ hiển thị trên card.
     track    Bài tiêu biểu.
     version  Phiên bản của bài, ví dụ "Phiên Bản Nam". Bỏ đi nếu không có.
     kind     "track" hoặc "album" — lấy từ chính link Spotify:
              open.spotify.com/track/...  -> kind:"track"
              open.spotify.com/album/...  -> kind:"album"
     id       Đoạn mã trong link Spotify, phần nằm sau /track/ hoặc /album/
              và TRƯỚC dấu ?. Ví dụ với
              open.spotify.com/track/6yzR1NyN...?si=ea1d68
              thì id là 6yzR1NyN...  (bỏ hẳn phần ?si=, đó chỉ là mã theo dõi
              lượt chia sẻ, không cần và không nên đưa lên web).
     streams  Số lượt nghe, ghi SỐ THUẦN không dấu phẩy: 13236991
     role     Vai trò, để bộ lọc chạy: producer · dj · vocalist · band ·
              songwriter · vj. Để trống thì card không hiện thẻ vai trò và
              thanh lọc tự ẩn đi. Nhiều vai trò thì cách nhau bằng dấu cách.
     photo    Đường dẫn ảnh, ví dụ "artists/tuan-hung.webp".
              Ảnh phải VUÔNG (1:1), nên xuất ở 800x800 và lưu dạng .webp.
              Bỏ tất cả vào thư mục artists/ ở gốc website (cạnh artists.html).
              Nên xuất thêm một bản 600x600 CÙNG TÊN vào artists/600/ —
              điện thoại sẽ tải bản nhỏ này. Quên thì trang vẫn chạy, chỉ
              là tải bản 800 nặng hơn.
              Để trống thì card dùng khối chữ viết tắt trên nền sóng.

   Thứ tự trong bảng không quan trọng — trang tự sắp theo lượt nghe.
   ===================================================================== */

const ARTISTS = [
  { name:"HƯƠNGMYBÔNG", track:"Say Một Đời Vì Em", version:"Phiên Bản Nam", kind:"track", id:"36HDVYZL4whJgqHte9NHBx", streams:1219194, role:"", photo:"/artists/huongmybong.webp" },
  { name:"TRO-Music", track:"ĐÀ LẠT CÒN MƯA KHÔNG EM", kind:"track", id:"24ZX4PNB6BbOWQdAJUW413", streams:726031, role:"", photo:"/artists/tro-music.webp" },
  { name:"Microwave", track:"Tìm Lại", kind:"track", id:"4ZtmF5ZseBMGWRgibW3bKJ", streams:725526, role:"", photo:"/artists/microwave.webp" },
  { name:"Trí Minh", track:"Để Gió Cuốn Đi", kind:"track", id:"3hGOyaXpY13pVSHyEd2KVM", streams:312775, role:"", photo:"/artists/tri-minh.webp" },
  { name:"nae & de'lay", track:"Đắp Chăn Bông", kind:"track", id:"6CMROH0r43Pot5yE955p2T", streams:308131, role:"", photo:"/artists/nae-delay.webp" },
  { name:"JesiLyn", track:"Chờ Lời Anh Nói", kind:"track", id:"5f0xDqDRQWxVj3SaZWb4wl", streams:177485, role:"", photo:"/artists/jesilyn.webp" },
  { name:"BeeBB", track:"Harla", kind:"track", id:"06b6C1q3YKCo6aD0Uli9Vy", streams:147344, role:"", photo:"/artists/beebb.webp" },
  { name:"Cáp Anh Tài", track:"Đừng Trách Câu Ví Dặm", kind:"track", id:"1xxnXjoLN5uqmsERgrFaAM", streams:107771, role:"", photo:"/artists/cap-anh-tai.webp" },
  { name:"Hà Quỳnh Như", track:"Giận Mà Thương", kind:"track", id:"66ScpKLaHz6t0gAHh2XmWp", streams:105312, role:"", photo:"/artists/ha-quynh-nhu.webp" },
  { name:"ResQ", track:"Lọ Vương", kind:"track", id:"445akPqedFnhwIE3wUbyjy", streams:63434, role:"", photo:"/artists/resq.webp" },
  { name:"Bách Phan", track:"Love Me Right", kind:"track", id:"4GKnPHsQ2iJBUNUCXsRqK5", streams:42752, role:"", photo:"/artists/bach-phan.webp" },
  { name:"Lope Dope", track:"Đêm Thành Phố", kind:"track", id:"0oXjDcT4qKLBLYY9lPRrHT", streams:2931346, role:"", photo:"/artists/lope-dope.webp" },
  { name:"blackvelvetz", track:"am i in love?", kind:"track", id:"3aRylVsspIDlhX1FrcP8xQ", streams:17892, role:"", photo:"/artists/blackvelvetz.webp" },
  { name:"Rosewood", track:"Mùa hè bất tận", kind:"track", id:"3UzdWJdc97NL7IBCDyYObU", streams:12200, role:"", photo:"/artists/rosewood.webp" },
  { name:"Mezzo", track:"Stuck!", kind:"album", id:"2D6B98kwXFK6vGpawT6UZP", streams:8623, role:"", photo:"/artists/mezzo.webp" },
  { name:"Qinie", track:"Xe Đạp", kind:"track", id:"0pbZKr7yHnzVSuhNRUqTmg", streams:2509, role:"", photo:"/artists/qinie.webp" },
  { name:"Lazy noize", track:"Tao Muốn Ngủ Ngon", kind:"track", id:"1kFP2NHQXJjgldl2Fz4VVn", streams:2410, role:"", photo:"/artists/lazy-noize.webp" },

  /* Thuộc roster chính thức, chưa có bài trong bảng "List Bài Của Haustek" —
     giữ nguyên ở đây dưới dạng card chờ dữ liệu, KHÔNG xoá. Điền photo /
     track / id / streams theo hướng dẫn ở đầu mảng là card tự đầy đủ. */
  { name:"Red Sheep", track:"Natural Order of Life", kind:"track", id:"6B6MPtLgCjl9iwYqtELwAI", streams:4984, role:"", photo:"/artists/red-sheep.webp" },
  { name:"ling:chi", track:"", kind:"track", id:"", streams:null, role:"", photo:"/artists/ling-chi.webp" },
  { name:"Chin", track:"Exfoliating", kind:"track", id:"62stFXy0jS1ezvPysLYMvy", streams:8298, role:"", photo:"/artists/chin.webp" },
  { name:"KONKRETE", track:"Under the Floor", kind:"track", id:"2ZiAUjxsLtyWPwmedH4gg3", streams:8012, role:"", photo:"/artists/konkrete.webp" },
  { name:"Tarnoise Spaceman", track:"Remote Land", kind:"track", id:"3JqCUCyTaQsWVLLPDHc8LE", streams:12850, role:"", photo:"/artists/tarnoise-spaceman.webp" },
  { name:"Oumii", track:"skin to skin", kind:"track", id:"4fNpMQNBiSlWG4jxRw8bmV", streams:7868, role:"", photo:"/artists/oumii.webp" },
  { name:"Attiss Ngo", track:"Thin Tails", kind:"track", id:"4CGVnpPwhmWnDeds8q8OVf", streams:14915, role:"", photo:"/artists/attiss-ngo.webp" },

  /* Hai người mới, thêm 31.07 — cả hai xác nhận là bài lẻ thật (không phải
     bản ghi set/DJ tại sự kiện), phát hành qua Haustek Records / sub-label. */
  { name:"Ro-TUNE", track:"Long Way Home", kind:"track", id:"0L4sFKd7mCeFD9ewRu9aNX", streams:null, role:"", photo:"/artists/ro-tune.webp" },
  { name:"Thiện Hí", track:"Đành Thôi Xa Cách", kind:"track", id:"6rfaZP4OoIep5aGB26IALu", streams:523083, role:"", photo:"/artists/thien-hi.webp" }
];
