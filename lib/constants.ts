/**
 * 사이트 전역 상수.
 *
 * MAILTO_HREF — Founder primary CTA와 Footer 문의가 동일 thread로 떨어지도록
 * subject/body가 인코딩된 mailto URL을 공유. 실 이메일 백엔드(Mailchimp/Resend 등)
 * 도착 시 이 한 곳만 교체하면 두 진입점이 함께 업데이트된다.
 */
export const MAILTO_HREF =
  "mailto:luxual8@gmail.com" +
  "?subject=%ED%95%9C%EA%B8%80%EA%B5%90%EC%88%98%EB%B2%95%20%EC%86%8C%EC%8B%9D%20%EC%8B%A0%EC%B2%AD" +
  "&body=%ED%95%9C%EA%B8%80%EA%B5%90%EC%88%98%EB%B2%95%20%EC%86%8C%EC%8B%9D%EC%9D%84%20%EB%B0%9B%EC%95%84%EB%B3%B4%EA%B3%A0%20%EC%8B%B6%EC%8A%B5%EB%8B%88%EB%8B%A4.";
