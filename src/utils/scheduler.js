import schedule from "node-schedule";
import { formatExcel } from "./excelFormatter.js";

export const schedulerExcel = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Applications");
  //   // Define the headers
  //   worksheet.columns = [
  //     { header: "User ID", key: "userId" },
  //     { header: "User Name", key: "userName" },
  //     { header: "User Email", key: "userEmail" },
  //     // Add more headers as needed
  //   ];
  //   // Add the data to the worksheet
  //   for (const application of applications) {
  //     worksheet.addRow({
  //       userId: application.name,
  //       userName: application.hrEmail,
  //       userEmail: application.userEmail,
  //       // Add more data as needed
  //     });
  //   }
  //   // Write the workbook to a file
  //   await workbook.xlsx.writeFile("Applications.xlsx");
};
