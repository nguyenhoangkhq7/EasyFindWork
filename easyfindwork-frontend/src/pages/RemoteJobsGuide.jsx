import React from 'react';
import { Layout, Typography, List, Card, Image, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const RemoteJobsGuide = () => {
  const jobs = [
    { 
      id: 1, 
      title: 'Nhân viên IT', 
      description: 'Đây là một trong những việc làm từ xa phổ biến nhất hiện nay không chỉ tại Việt Nam mà còn trên thế giới. Chỉ cần đáp ứng các KPI công việc đặt ra, bạn hoàn toàn có thể nhận được mức thu nhập từ 10 triệu đồng đến 15 triệu đồng hoặc cao hơn nếu có kinh nghiệm lâu năm.', 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' 
    },
    { 
      id: 2, 
      title: 'Nhân viên sáng tạo nội dung', 
      description: 'Sáng tạo nội dung cũng là một việc làm remote phổ biến. Chỉ cần đảm nhiệm công việc đúng tiến độ, đúng chất lượng, mức thu nhập của bạn có thể dao động từ 8 triệu đồng tới 10 triệu đồng hoặc cao hơn tuỳ theo kinh nghiệm.', 
      image: 'https://images.unsplash.com/photo-1455390582262-044c498ce311' 
    },
    { 
      id: 3, 
      title: 'Nhân viên thiết kế/Designer', 
      description: 'Thiết kế đồ họa là việc làm từ xa phổ biến tiếp theo được nhiều người lựa chọn. Công việc này có thể mang đến thu nhập từ 10 triệu đồng tới 15 triệu đồng mỗi tháng tuỳ theo yêu cầu.', 
      image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' 
    },
    { 
      id: 4, 
      title: 'Nhân viên quảng cáo', 
      description: 'Chạy quảng cáo trên các nền tảng online như Google Ads, Facebook Ads, Zalo Ads… cũng là một việc làm từ xa. Mức lương dao động từ 5 triệu đồng tới 10 triệu đồng hoặc hơn kèm theo cả hoa hồng.', 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' 
    },
    { 
      id: 5, 
      title: 'Nhân viên Telesale', 
      description: 'Công việc của bạn là thực hiện các cuộc gọi theo kịch bản và gọi tới danh sách data được phân. Mức thu nhập dao động từ 4 triệu đồng đến 6 triệu đồng kèm thêm thưởng doanh thu.', 
      image: 'https://images.unsplash.com/photo-1596524430610-40125146e3c2' 
    },
    { 
      id: 6, 
      title: 'Nhân viên Game Developer', 
      description: 'Với sự phát triển của ngành công nghiệp game, game developer trở thành việc làm từ xa được nhiều người lựa chọn. Đòi hỏi khả năng lập trình, sáng tạo và thiết kế.', 
      image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' 
    },
    { 
      id: 7, 
      title: 'Nhân viên SEO', 
      description: 'Công việc SEO cho một website không đòi hỏi bạn phải thường xuyên có mặt tại văn phòng. Mức thu nhập dao động từ 10 triệu đồng đến 15 triệu đồng mỗi tháng hoặc cao hơn.', 
      image: 'https://images.unsplash.com/photo-1455390582262-044c498ce311' 
    },
  ];

  return (
    <Layout style={{ padding: '0 50px', minHeight: '100vh' }}>
      <Content style={{ margin: '20px 0' }}>
        <Card>
          <Title level={2}>Top 7 việc làm remote phổ biến, đem lại thu nhập tốt hiện nay</Title>
          <Text>Bởi Thuyen Dang • 2 tháng trước</Text>
          <Paragraph>Chia sẻ bài viết này</Paragraph>
          <Paragraph>
            Với ưu điểm thu nhập tốt, làm việc tại nhà mà không cần tới văn phòng, làm remote đang là xu hướng công việc được nhiều người lựa chọn. Vậy việc làm remote là gì? Cùng Việc Làm 24h tìm hiểu kỹ hơn về hình thức làm việc này cũng như top 7 việc làm từ xa phổ biến hiện nay.
          </Paragraph>

          <Title level={3}>1. Làm remote là gì ?</Title>
          <Paragraph>
            Việc làm remote (remote working, làm việc từ xa) là hình thức làm việc mà nhân viên không cần đến văn phòng hoặc tuân thủ theo quy định làm việc cố định của doanh nghiệp. Thay vào đó, họ có thể làm việc tại nhà hoặc tại bất cứ địa điểm nào có kết nối Internet.
          </Paragraph>
          <ul>
            <li><strong>Làm từ xa 100%:</strong> Là hình thức bạn làm việc hoàn toàn từ xa và không phải tới văn phòng.</li>
            <li><strong>Làm việc bán từ xa:</strong> Là hình thức luân phiên vừa làm từ xa, vừa lên văn phòng.</li>
          </ul>
          <Paragraph>
            Nhân viên làm việc từ xa vẫn được hưởng các đãi ngộ như nhân viên chính thức, chỉ khác về địa điểm làm việc.
          </Paragraph>
          <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" alt="Remote Work" />

          <Title level={3}>2. Ưu và nhược điểm của việc làm remote là gì?</Title>
          <Title level={4}>2.1. Ưu điểm của việc làm remote</Title>
          <ul>
            <li>Tiết kiệm thời gian, công sức, phí đi lại.</li>
            <li>Giờ giấc làm việc linh hoạt.</li>
            <li>Tự do về không gian.</li>
            <li>Chủ động quản lý công việc.</li>
            <li>Giúp tăng sự thoải mái và đạt hiệu quả công việc tốt hơn.</li>
            <li>Giúp nhân viên cân bằng cuộc sống với công việc, giải tỏa căng thẳng tốt hơn.</li>
            <li>Doanh nghiệp tiết kiệm được chi phí thuê mặt bằng và máy móc.</li>
          </ul>

          <Title level={4}>2.2. Nhược điểm của việc làm remote</Title>
          <ul>
            <li>Đòi hỏi tính kỷ luật cao.</li>
            <li>Khó khăn khi làm việc nhóm.</li>
            <li>Giảm tương tác cùng đồng nghiệp.</li>
            <li>Khó giải quyết vấn đề.</li>
            <li>Giảm sự gắn kết do không có môi trường làm việc chung.</li>
            <li>Doanh nghiệp khó quản lý nhân sự hơn.</li>
            <li>Không được hưởng các phúc lợi làm việc tại văn phòng như chi phí ăn trưa, tiệc giữa giờ, hoạt động vui chơi.</li>
          </ul>

          <Title level={3}>3. Lợi ích khi làm việc Remote</Title>
          <Title level={4}>3.1. Lợi ích đối với người lao động</Title>
          <Title level={5}>3.1.1. Mang đến lối sống linh hoạt</Title>
          <Paragraph>
            Với hình thức làm việc từ xa, nhân viên không còn bị ràng buộc bởi không gian văn phòng truyền thống, tạo điều kiện để họ tập trung tốt hơn vào các công việc quan trọng. Đặc biệt, đối với những bậc phụ huynh có con nhỏ, họ có thể bắt đầu ngày làm việc sớm hơn, vừa hoàn thành nhiệm vụ công việc, vừa dành thời gian chăm sóc con cái.
          </Paragraph>
          <Image src="https://images.unsplash.com/photo-1600585154347-be6161a56a0c" alt="Flexible Lifestyle" />

          <Title level={5}>3.1.2. Cải thiện tình trạng sức khoẻ</Title>
          <Paragraph>
            Với mô hình làm việc linh hoạt, nhân viên có thể tự do chọn thời gian và địa điểm làm việc phù hợp với sở thích cá nhân. Điều này không chỉ giúp giảm căng thẳng mà còn nâng cao sự hứng khởi trong công việc. Theo một nghiên cứu từ Hiệp hội Y tế Công cộng Hoàng gia Anh, 55% người tham gia khảo sát cho biết, họ cảm thấy làm việc tại văn phòng tạo ra nhiều căng thẳng hơn so với khi làm việc từ xa.
          </Paragraph>

          <Title level={5}>3.1.2. Tạo hứng khởi khi làm việc</Title>
          <Paragraph>
            Một môi trường làm việc linh hoạt, không bị giới hạn trong không gian văn phòng sẽ mang đến cho nhân viên cảm giác tự do và thoải mái. Điều này không chỉ thúc đẩy sự sáng tạo mà còn nâng cao hiệu suất làm việc.
          </Paragraph>

          <Title level={4}>3.2. Lợi ích đối với quản lý</Title>
          <Title level={5}>3.2.1. Tiết kiệm chi phí</Title>
          <Paragraph>
            Mô hình làm việc từ xa không chỉ mang lại lợi ích cho nhân viên mà còn cho cả doanh nghiệp. Doanh nghiệp có thể tiết kiệm được một khoản lớn từ việc không phải chi trả cho thuê văn phòng và mua sắm trang thiết bị nội thất.
          </Paragraph>
          <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" alt="Cost Saving" />

          <Title level={5}>3.2.2. Tạo động lực gắn bó cho nhân viên</Title>
          <Paragraph>
            Khi áp dụng mô hình làm việc từ xa, các doanh nghiệp cho phép nhân viên tự do chọn lựa không gian làm việc mà họ cảm thấy thoải mái. Điều này không chỉ giúp nâng cao năng suất công việc mà còn thúc đẩy sự gắn kết bền chặt hơn giữa nhân viên và tổ chức.
          </Paragraph>

          <Title level={3}>4. Các yếu tố cần thiết để làm việc Remote hiệu quả</Title>
          <Title level={4}>4.1. Kỹ năng mềm</Title>
          <Paragraph>
            Để làm remote hiệu quả, các kỹ năng mềm đóng vai trò cực kỳ quan trọng, nhất là khi không có sự giám sát trực tiếp. Kỹ năng quản lý thời gian, giải quyết vấn đề giúp duy trì năng suất và đảm bảo công việc được hoàn thành đúng hạn.
          </Paragraph>
          <Image src="https://images.unsplash.com/photo-1455390582262-044c498ce311" alt="Soft Skills" />

          <Title level={4}>4.2. Môi trường làm việc</Title>
          <Paragraph>
            Môi trường làm việc có tác động lớn đến năng suất và chất lượng công việc. Một không gian làm việc yên tĩnh, ngăn nắp và đầy đủ các trang thiết bị cần thiết sẽ giúp bạn duy trì sự tập trung cao.
          </Paragraph>

          <Title level={4}>4.3. Khả năng kết nối</Title>
          <Paragraph>
            Khả năng kết nối là kỹ năng sống còn đối với người làm việc remote. Việc duy trì liên lạc thường xuyên qua các nền tảng như email, ứng dụng nhắn tin hay họp trực tuyến không chỉ giúp các thành viên phối hợp nhịp nhàng mà còn đảm bảo trao đổi thông tin một cách nhanh chóng, chính xác.
          </Paragraph>

          <Title level={3}>5. Những công việc làm Remote phổ biến hiện nay</Title>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={jobs}
            renderItem={item => (
              <List.Item>
                <Card title={`${item.id}. ${item.title}`}>
                  <Image src={item.image} alt={item.title} style={{ maxWidth: '100%' }} />
                  <Paragraph>{item.description}</Paragraph>
                  {item.id === 1 && (
                    <Button type="primary">
                      <Link to="/jobs/it">ỨNG TUYỂN VIỆC LÀM IT TẠI ĐÂY</Link>
                    </Button>
                  )}
                  {item.id === 3 && (
                    <Button type="primary">
                      <Link to="/jobs/design">ỨNG TUYỂN VỊ TRÍ THIẾT KẾ ĐỒ HỌA</Link>
                    </Button>
                  )}
                  {item.id === 4 && (
                    <Button type="primary">
                      <Link to="/jobs/ads">ỨNG TUYỂN VỊ TRÍ QUẢNG CÁO</Link>
                    </Button>
                  )}
                  {item.id === 7 && (
                    <Button type="primary">
                      <Link to="/jobs/seo">ỨNG TUYỂN VỊ TRÍ NHÂN VIÊN SEO</Link>
                    </Button>
                  )}
                </Card>
              </List.Item>
            )}
          />

          <Title level={3}>6. Cần lưu ý gì khi chọn việc làm Remote</Title>
          <ul>
            <li>Luôn kiểm tra nguồn thông tin tuyển dụng trước khi ứng tuyển (tên công ty, địa chỉ, số điện thoại, lĩnh vực hoạt động…).</li>
            <li>Đọc kỹ các mô tả trong phần thông tin tuyển dụng, nâng cao cảnh giác nếu thấy bất cứ điểm nào không hợp lý hoặc các đãi ngộ quá hấp dẫn đến mức bất hợp lý.</li>
            <li>Tìm hiểu rõ ràng về quy trình tuyển dụng cũng như chính sách đối với nhân viên làm việc remote của doanh nghiệp.</li>
            <li>Cảnh giác với các thông tin yêu cầu nộp lệ phí ứng tuyển.</li>
            <li>Thu thập thêm phản hồi hoặc đánh giá từ người khác về nhà tuyển dụng hoặc công việc này.</li>
            <li>Thận trọng với những việc làm có mức lương cao bất thường.</li>
            <li>Nên thận trọng với các bên trung gian giới thiệu việc làm không rõ nguồn gốc.</li>
            <li>Chỉ nên tìm việc tại các kênh thông tin chính thống từ nhà tuyển dụng bạn tin tưởng hoặc các kênh thông tin việc làm uy tín.</li>
            <li>Cảnh giác với những đơn vị yêu cầu nộp giấy tờ hoặc hồ sơ cá nhân gốc.</li>
          </ul>
          <Image src="https://images.unsplash.com/photo-1596524430610-40125146e3c2" alt="Caution" />

          <Title level={3}>Lời kết</Title>
          <Paragraph>
            Trên đây, Việc Làm 24h đã chia sẻ với bạn những thông tin cơ bản về khái niệm việc làm remote là gì. Đồng thời, bài viết cũng bật mí top những công việc làm từ xa có thu nhập hấp dẫn cùng những lưu ý giúp bạn tìm việc làm từ xa hiệu quả hơn. Đừng quên thường xuyên theo dõi Blog Việc làm 24h để bổ sung những kiến thức nghề nghiệp hữu ích!
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
};

export default RemoteJobsGuide;