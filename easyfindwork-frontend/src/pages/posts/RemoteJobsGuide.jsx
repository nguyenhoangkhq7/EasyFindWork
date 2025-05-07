import React from "react";
import { Typography, List, Card, Image, Button } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const RemoteJobsGuide = () => {
  const jobs = [
    {
      id: 1,
      title: "Nhân viên IT",
      description:
        "Đây là một trong những việc làm từ xa phổ biến nhất hiện nay không chỉ tại Việt Nam mà còn trên thế giới. Chỉ cần đáp ứng các KPI công việc đặt ra, bạn hoàn toàn có thể nhận được mức thu nhập từ 10 triệu đồng đến 15 triệu đồng hoặc cao hơn nếu có kinh nghiệm lâu năm.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      id: 2,
      title: "Nhân viên sáng tạo nội dung",
      description:
        "Sáng tạo nội dung cũng là một việc làm remote phổ biến. Chỉ cần đảm nhiệm công việc đúng tiến độ, đúng chất lượng, mức thu nhập của bạn có thể dao động từ 8 triệu đồng tới 10 triệu đồng hoặc cao hơn tuỳ theo kinh nghiệm.",
      image: "https://images.unsplash.com/photo-1455390582262-044c498ce311",
    },
    {
      id: 3,
      title: "Nhân viên thiết kế/Designer",
      description:
        "Thiết kế đồ họa là việc làm từ xa phổ biến tiếp theo được nhiều người lựa chọn. Công việc này có thể mang đến thu nhập từ 10 triệu đồng tới 15 triệu đồng mỗi tháng tuỳ theo yêu cầu.",
      image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
    },
    {
      id: 4,
      title: "Nhân viên quảng cáo",
      description:
        "Chạy quảng cáo trên các nền tảng online như Google Ads, Facebook Ads, Zalo Ads… cũng là một việc làm từ xa. Mức lương dao động từ 5 triệu đồng tới 10 triệu đồng hoặc hơn kèm theo cả hoa hồng.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      id: 5,
      title: "Nhân viên Telesale",
      description:
        "Công việc của bạn là thực hiện các cuộc gọi theo kịch bản và gọi tới danh sách data được phân. Mức thu nhập dao động từ 4 triệu đồng đến 6 triệu đồng kèm thêm thưởng doanh thu.",
      image: "https://images.unsplash.com/photo-1596524430610-40125146e3c2",
    },
    {
      id: 6,
      title: "Nhân viên Game Developer",
      description:
        "Với sự phát triển của ngành công nghiệp game, game developer trở thành việc làm từ xa được nhiều người lựa chọn. Đòi hỏi khả năng lập trình, sáng tạo và thiết kế.",
      image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
    },
    {
      id: 7,
      title: "Nhân viên SEO",
      description:
        "Công việc SEO cho một website không đòi hỏi bạn phải thường xuyên có mặt tại văn phòng. Mức thu nhập dao động từ 10 triệu đồng đến 15 triệu đồng mỗi tháng hoặc cao hơn.",
      image: "https://images.unsplash.com/photo-1455390582262-044c498ce311",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="shadow-lg rounded-lg p-6 bg-white">
            <Title level={2} className="text-blue-600 font-bold text-center">
              Top 7 Việc Làm Remote Phổ Biến, Thu Nhập Hấp Dẫn
            </Title>
            <Text className="block text-gray-500 text-center mb-4">
              Bởi Thuyen Dang • 2 tháng trước
            </Text>
            <Paragraph className="text-gray-600 text-center">
              Chia sẻ bài viết này
            </Paragraph>
            <Paragraph className="text-gray-700 leading-relaxed">
              Với ưu điểm thu nhập tốt, làm việc tại nhà mà không cần tới văn
              phòng, làm remote đang là xu hướng công việc được nhiều người lựa
              chọn. Cùng Việc Làm 24h tìm hiểu kỹ hơn về hình thức làm việc này
              cũng như top 7 việc làm từ xa phổ biến hiện nay.
            </Paragraph>

            <Title level={3} className="text-blue-500 mt-6">
              1. Làm remote là gì?
            </Title>
            <Paragraph className="text-gray-700">
              Việc làm remote (remote working, làm việc từ xa) là hình thức làm
              việc mà nhân viên không cần đến văn phòng hoặc tuân thủ theo quy
              định làm việc cố định của doanh nghiệp. Thay vào đó, họ có thể làm
              việc tại nhà hoặc tại bất cứ địa điểm nào có kết nối Internet.
            </Paragraph>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <strong>Làm từ xa 100%:</strong> Làm việc hoàn toàn từ xa và
                không phải tới văn phòng.
              </li>
              <li>
                <strong>Làm việc bán từ xa:</strong> Luân phiên vừa làm từ xa,
                vừa lên văn phòng.
              </li>
            </ul>
            <Paragraph className="text-gray-700">
              Nhân viên làm việc từ xa vẫn được hưởng các đãi ngộ như nhân viên
              chính thức, chỉ khác về địa điểm làm việc.
            </Paragraph>
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Remote Work"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={3} className="text-blue-500 mt-6">
              2. Ưu và nhược điểm của việc làm remote
            </Title>
            <Title level={4} className="text-blue-400">
              2.1. Ưu điểm
            </Title>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Tiết kiệm thời gian, công sức, phí đi lại.</li>
              <li>Giờ giấc làm việc linh hoạt.</li>
              <li>Tự do về không gian.</li>
              <li>Chủ động quản lý công việc.</li>
              <li>Giúp tăng sự thoải mái và đạt hiệu quả công việc tốt hơn.</li>
              <li>
                Giúp nhân viên cân bằng cuộc sống với công việc, giải tỏa căng
                thẳng tốt hơn.
              </li>
              <li>
                Doanh nghiệp tiết kiệm được chi phí thuê mặt bằng và máy móc.
              </li>
            </ul>

            <Title level={4} className="text-blue-400">
              2.2. Nhược điểm
            </Title>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Đòi hỏi tính kỷ luật cao.</li>
              <li>Khó khăn khi làm việc nhóm.</li>
              <li>Giảm tương tác cùng đồng nghiệp.</li>
              <li>Khó giải quyết vấn đề.</li>
              <li>Giảm sự gắn kết do không có môi trường làm việc chung.</li>
              <li>Doanh nghiệp khó quản lý nhân sự hơn.</li>
              <li>
                Không được hưởng các phúc lợi làm việc tại văn phòng như chi phí
                ăn trưa, tiệc giữa giờ, hoạt động vui chơi.
              </li>
            </ul>

            <Title level={3} className="text-blue-500 mt-6">
              3. Lợi ích khi làm việc Remote
            </Title>
            <Title level={4} className="text-blue-400">
              3.1. Lợi ích đối với người lao động
            </Title>
            <Title level={5} className="text-blue-300">
              3.1.1. Mang đến lối sống linh hoạt
            </Title>
            <Paragraph className="text-gray-700">
              Với hình thức làm việc từ xa, nhân viên không còn bị ràng buộc bởi
              không gian văn phòng truyền thống, tạo điều kiện để họ tập trung
              tốt hơn vào các công việc quan trọng.
            </Paragraph>
            <Image
              src="https://images.unsplash.com/photo-1600585154347-be6161a56a0c"
              alt="Flexible Lifestyle"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={5} className="text-blue-300">
              3.1.2. Cải thiện tình trạng sức khỏe
            </Title>
            <Paragraph className="text-gray-700">
              Với mô hình làm việc linh hoạt, nhân viên có thể tự do chọn thời
              gian và địa điểm làm việc phù hợp với sở thích cá nhân, giúp giảm
              căng thẳng và nâng cao sự hứng khởi.
            </Paragraph>

            <Title level={5} className="text-blue-300">
              3.1.3. Tạo hứng khởi khi làm việc
            </Title>
            <Paragraph className="text-gray-700">
              Một môi trường làm việc linh hoạt, không bị giới hạn trong không
              gian văn phòng sẽ mang đến cảm giác tự do và thoải mái, thúc đẩy
              sự sáng tạo và hiệu suất.
            </Paragraph>

            <Title level={4} className="text-blue-400">
              3.2. Lợi ích đối với quản lý
            </Title>
            <Title level={5} className="text-blue-300">
              3.2.1. Tiết kiệm chi phí
            </Title>
            <Paragraph className="text-gray-700">
              Doanh nghiệp có thể tiết kiệm được một khoản lớn từ việc không
              phải chi trả cho thuê văn phòng và mua sắm trang thiết bị nội
              thất.
            </Paragraph>
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Cost Saving"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={5} className="text-blue-300">
              3.2.2. Tạo động lực gắn/keys bó cho nhân viên
            </Title>
            <Paragraph className="text-gray-700">
              Cho phép nhân viên tự do chọn không gian làm việc thoải mái giúp
              nâng cao năng suất và thúc đẩy sự gắn kết với tổ chức.
            </Paragraph>

            <Title level={3} className="text-blue-500 mt-6">
              4. Các yếu tố cần thiết để làm việc Remote hiệu quả
            </Title>
            <Title level={4} className="text-blue-400">
              4.1. Kỹ năng mềm
            </Title>
            <Paragraph className="text-gray-700">
              Kỹ năng quản lý thời gian, giải quyết vấn đề giúp duy trì năng
              suất và đảm bảo công việc được hoàn thành đúng hạn.
            </Paragraph>
            <Image
              src="https://images.unsplash.com/photo-1455390582262-044c498ce311"
              alt="Soft Skills"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={4} className="text-blue-400">
              4.2. Môi trường làm việc
            </Title>
            <Paragraph className="text-gray-700">
              Một không gian làm việc yên tĩnh, ngăn nắp và đầy đủ các trang
              thiết bị cần thiết sẽ giúp bạn duy trì sự tập trung cao.
            </Paragraph>

            <Title level={4} className="text-blue-400">
              4.3. Khả năng kết nối
            </Title>
            <Paragraph className="text-gray-700">
              Duy trì liên lạc thường xuyên qua email, ứng dụng nhắn tin hay họp
              trực tuyến đảm bảo trao đổi thông tin nhanh chóng, chính xác.
            </Paragraph>

            <Title level={3} className="text-blue-500 mt-6">
              5. Những công việc làm Remote phổ biến hiện nay
            </Title>
            <List
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2 }}
              dataSource={jobs}
              renderItem={(item) => (
                <List.Item>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      className="shadow-md hover:shadow-lg transition-shadow duration-300"
                      title={
                        <span className="text-lg font-semibold text-blue-600">{`${item.id}. ${item.title}`}</span>
                      }
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="rounded-lg w-full h-48 object-cover mb-4"
                      />
                      <Paragraph className="text-gray-600">
                        {item.description}
                      </Paragraph>
                      {(item.id === 1 ||
                        item.id === 3 ||
                        item.id === 4 ||
                        item.id === 7) && (
                        <Button
                          type="primary"
                          className="bg-blue-500 hover:bg-blue-600 mt-4 w-full"
                        >
                          <Link
                            to={`/jobs/${
                              item.id === 1
                                ? "it"
                                : item.id === 3
                                ? "design"
                                : item.id === 4
                                ? "ads"
                                : "seo"
                            }`}
                          >
                            ỨNG TUYỂN {item.title.toUpperCase()}
                          </Link>
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                </List.Item>
              )}
            />

            <Title level={3} className="text-blue-500 mt-6">
              6. Cần lưu ý gì khi chọn việc làm Remote
            </Title>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                Luôn kiểm tra nguồn thông tin tuyển dụng trước khi ứng tuyển.
              </li>
              <li>
                Đọc kỹ mô tả công việc, cảnh giác với các đãi ngộ bất hợp lý.
              </li>
              <li>
                Tìm hiểu quy trình tuyển dụng và chính sách cho nhân viên
                remote.
              </li>
              <li>Cảnh giác với yêu cầu nộp lệ phí ứng tuyển.</li>
              <li>Thu thập đánh giá từ người khác về nhà tuyển dụng.</li>
              <li>Thận trọng với mức lương cao bất thường.</li>
              <li>Chỉ tìm việc tại các kênh thông tin uy tín.</li>
              <li>Cảnh giác với yêu cầu nộp giấy tờ cá nhân gốc.</li>
            </ul>
            <Image
              src="https://images.unsplash.com/photo-1596524430610-40125146e3c2"
              alt="Caution"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={3} className="text-blue-500 mt-6">
              Lời kết
            </Title>
            <Paragraph className="text-gray-700">
              Việc Làm 24h đã chia sẻ thông tin về khái niệm việc làm remote
              cùng top công việc từ xa có thu nhập hấp dẫn. Đừng quên theo dõi
              Blog Việc Làm 24h để cập nhật kiến thức nghề nghiệp hữu ích!
            </Paragraph>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RemoteJobsGuide;
