import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

export function fetchMock(url: string, suffix = "") {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        json: () =>
          Promise.resolve({
            data: url + suffix,
          }),
      });
    }, 200 + Math.random() * 300)
  );
}

// export const axiosGet = () => {
// 	jest.mock("axios");
// 	axios.get.mockResolvedValue({
// 		data: [
// 			{
// 			userId: 1,
// 			id: 1,
// 			title: "My First Album",
// 			},
// 			{
// 			userId: 1,
// 			id: 2,
// 			title: "Album: The Sequel",
// 			},
// 		],
// 	  });
// }