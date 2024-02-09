import ExcelJS from "exceljs";

export const formatExcel = async (applications) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    // Define the headers
    worksheet.columns = [
      { header: "User ID", key: "userId" },
      { header: "User Name", key: "userName" },
      { header: "User Email", key: "userEmail" },
    ];

    // Add the data to the worksheet
    for (const application of applications) {
      worksheet.addRow({
        userId: application.name,
        userName: application.hrEmail,
        userEmail: application.userEmail,
        //get every attr from application and add it to the row
      });
    }
    //also can be sent by mail here or as response to FE
    await workbook.xlsx.writeFile("Applications.xlsx");
  } catch (error) {
    return new Error("Error in formatting excel");
  }
};
