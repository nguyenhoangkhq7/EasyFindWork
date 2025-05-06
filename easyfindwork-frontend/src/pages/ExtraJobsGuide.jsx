import React from 'react';

const jobs = [
  { id: 1, title: 'Content Creator', description: 'Không nhất thiết phải cần tới năng khiếu viết lách, bạn vẫn có thể trở thành một content creator trên nhiều nền tảng và có thêm thu nhập ngoài giờ hành chính. Những công việc có thể bao gồm: sáng tạo hình ảnh (chụp, thiết kế…), dựng video (quay, dựng, biên tập…), viết lách (bài SEO, bài quảng cáo, bài cộng tác cho báo, viết review, viết truyện…). Đây là những công việc có thể làm tại nhà, không cần vốn, không đặt cọc.', image: 'https://images.unsplash.com/photo-1455390582262-044c498ce311' },
  { id: 2, title: 'Dịch thuật/ phiên dịch', description: 'Đây là việc làm thêm cực phù hợp với những ai thành thạo ngoại ngữ. Bạn có thể nhận dịch tài liệu từ tiếng nước ngoài sang tiếng Việt hoặc phiên dịch part-time cho những công ty có nhu cầu. Chỉ cần chăm chỉ, kỹ năng tốt, bạn hoàn toàn có thể nhận được mức thu nhập khá tốt và ổn định tùy theo năng lực cá nhân.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
  { id: 3, title: 'Trực page', description: 'Công việc tương đối đơn giản là trả lời các bình luận hoặc tin nhắn từ khách hàng tới trang fanpage của doanh nghiệp. Thông thường, sẽ có các kịch bản chăm sóc khách hàng được soạn thảo sẵn để bạn tham khảo và thực hiện theo. Thời gian trực page thường chia theo ca, bạn có thể tranh thủ thời gian ngoài giờ vào buổi tối.', image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' },
  { id: 4, title: 'Tiếp thị liên kết', description: 'Nếu bạn sở hữu một trang mạng xã hội có lượng người theo dõi tốt, một website có khách truy cập thường xuyên, bạn hoàn toàn có thể kiếm thêm tiền từ tiếp thị liên kết (Affiliate Marketing). Đây là hình thức kiếm tiền mang lại nguồn thu tương đối hấp dẫn. Bạn có thể hợp tác cùng các đơn vị liên kết để đặt đường link bán hàng và nhận hoa hồng từ số sản phẩm bán ra.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
  { id: 5, title: 'Kinh doanh đồ handmade', description: 'Bạn khéo tay, thích làm các sản phẩm thủ công như đồ đan, móc, đồ mộc, trang sức… Bạn có thể bán các sản phẩm trên trang mạng xã hội cá nhân hoặc tạo gian hàng nhỏ trên các sàn thương mại điện tử và bán sản phẩm tự làm trong thời gian rảnh.', image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' },
  { id: 6, title: 'Kinh doanh POD', description: 'Kinh doanh POD (Print-on-Demand) là một trong những công việc mới nổi những năm gần đây. Bạn sẽ bán các ý tưởng thiết kế để in lên đồ vật (áo thun, cốc uống nước, túi xách, ốp điện thoại…) trên một nền tảng được cung cấp sẵn. Một bên liên kết sẽ thực hiện việc in ấn, đóng gói và giao tận tay, bạn sẽ được hưởng lợi nhuận từ mỗi sản phẩm bán ra.', image: 'https://images.unsplash.com/photo-1455390582262-044c498ce311' },
  { id: 7, title: 'Xe ôm công nghệ', description: 'Với sự phát triển mạnh mẽ của nhiều nền tảng gọi xe trực tuyến như Grab, Be, Xanh SM… và nhu cầu đi lại lớn tại các thành phố, nhiều dân văn phòng có thể tranh thủ làm thêm vài “cuốc” xe sau giờ làm để có thêm thu nhập.', image: 'https://images.unsplash.com/photo-1596524430610-40125146e3c2' },
  { id: 8, title: 'Gia sư/đào tạo', description: 'Đây là một trong những việc làm thêm có thu nhập tốt và nhu cầu cao. Bạn có thể dạy kèm ngoại ngữ hoặc các môn học theo nhu cầu. Thời lượng mỗi buổi học thường chỉ kéo dài từ 1,5 đến 2 giờ nhưng mang lại mức thu nhập hấp dẫn.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
  { id: 9, title: 'Giữ trẻ/chăm sóc trẻ em', description: 'Nếu bạn là người có kinh nghiệm chăm sóc trẻ em và có nhiều thời gian rảnh sau giờ làm, bạn hoàn toàn có thể nhận các việc làm thêm như chăm sóc trẻ (tắm cho trẻ em, massage cho trẻ em…) hoặc trông giữ trẻ theo giờ.', image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' },
  { id: 10, title: 'Kế toán', description: 'Kế toán cũng là một trong những việc làm thêm ngoài giờ có mức thu nhập tốt, nhất là mùa cuối năm, khi các doanh nghiệp cần làm báo cáo tài chính. Bạn là kế toán có kinh nghiệm lâu năm, bạn hoàn toàn có thể nhận công việc làm thêm.', image: 'https://images.unsplash.com/photo-1455390582262-044c498ce311' },
  { id: 11, title: 'Nhân viên bán hàng', description: 'Bán hàng là việc làm thêm ngoài giờ phổ biến được nhiều người lựa chọn. Bạn có thể tìm việc làm nhân viên bán hàng tại nhiều cửa hàng hoặc siêu thị với giờ làm theo ca (khoảng 4 giờ/ca) vào buổi tối. Công việc này không yêu cầu cao về kinh nghiệm hay chuyên môn.', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df' },
  { id: 12, title: 'Designer', description: 'Nếu bạn có trình độ thiết kế tốt, khả năng thiết kế đa dạng trong nhiều lĩnh vực, bạn hoàn toàn có thể nhận thêm việc thiết kế thuê ngoài từ các doanh nghiệp hoặc công ty có nhu cầu. Đây là việc làm thêm có thu nhập tương đối tốt.', image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' },
  { id: 13, title: 'Trợ lý online', description: 'Bạn sẽ đảm nhận các đầu việc về rà soát các loại văn bản giấy tờ, trả lời email, đặt lịch hẹn, sắp xếp lịch làm việc, nhắc việc… cho khách hàng. Công việc có thể hoàn toàn thực hiện online vào buổi tối.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
];

const JobCard = ({ job }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <img src={job.image} alt={job.title} className="w-full h-48 object-cover rounded-md mb-2" />
    <h3 className="text-lg font-semibold text-purple-800 mb-2">{job.title}</h3>
    <p className="text-gray-700 text-sm">{job.description}</p>
    {job.id === 13 && (
      <a
        href="/jobs/assistant"
        className="inline-block mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
      >
        TÌM VIỆC TRỢ LÝ TẠI ĐÂY
      </a>
    )}
  </div>
);

const ExtraJobsGuide = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-purple-900 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Việc làm thêm ngoài giờ hành chính</h1>
        <p className="text-sm">Tìm việc làm thêm phù hợp với bạn ngay hôm nay!</p>
      </header>

      <div className="container mx-auto p-4">
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Top việc làm ngoài giờ hành chính lương cao</h2>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Lưu ý khi tìm việc làm thêm ngoài giờ</h2>
          <ul className="list-disc pl-6 text-gray-700 text-sm mb-4">
            <li>Cảnh giác với những công việc phải trả phí để nhận việc.</li>
            <li>Chỉ nên tìm việc trên các website việc làm uy tín.</li>
            <li>Tìm hiểu kỹ thông tin về thương hiệu tuyển dụng.</li>
            <li>Tránh những việc làm có mức lương bất thường so với mô tả.</li>
          </ul>
          <img
            src="https://images.unsplash.com/photo-1596524430610-40125146e3c2"
            alt="Caution"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Lời kết</h2>
          <p className="text-gray-700 text-sm">
            Trên đây là top việc làm thêm ngoài giờ phổ biến hiện nay. Hy vọng những bài viết giúp bạn tìm được công việc phù hợp để tăng thêm thu nhập!
          </p>
        </section>

        <footer className="bg-purple-900 text-white p-4 text-center">
          <p className="text-sm">Bắt đầu tìm việc ngay hôm nay!</p>
          <div className="mt-2">
            <a href="#" className="text-purple-300 hover:text-white mr-4">Điều khoản sử dụng</a>
            <a href="#" className="text-purple-300 hover:text-white">Chính sách bảo mật</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExtraJobsGuide;