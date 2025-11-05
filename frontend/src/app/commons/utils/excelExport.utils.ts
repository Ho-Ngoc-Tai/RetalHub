import * as ExcelJS from "exceljs";
import { FrontendUser } from "./userTransform.utils";
import { FrontendReferralUser } from "./referralTransform.utils";
import { MiningUser } from "@stores/reducers/miningUsers";

export const exportUsersToExcel = async (users: FrontendUser[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Admin System";
  workbook.lastModifiedBy = "Admin System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("User List");

  worksheet.columns = [
    { header: "No.", key: "stt", width: 10 },
    { header: "Fullname", key: "fullname", width: 30 },
    { header: "Username", key: "username", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Registration Date", key: "createdDate", width: 20 },
    { header: "Status", key: "status", width: 17 },
  ];

  users.forEach((user, index) => {
    const statusMap = {
      active: "Active",
      locked: "Blocked",
      pending: "OTP Not Verified",
    };

    worksheet.addRow({
      stt: index + 1,
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      createdDate: user.createdDate || "",
      status: statusMap[user.status as keyof typeof statusMap] || user.status,
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 12,
      name: "Arial",
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDDEEFF" },
    };
    cell.border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };
  });

  for (let i = 2; i <= users.length + 1; i++) {
    const row = worksheet.getRow(i);
    row.eachCell((cell) => {
      // Add border to all cells
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Căn giữa tất cả các cell
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "User List.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportReferralUsersToExcel = async (users: FrontendReferralUser[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Admin System";
  workbook.lastModifiedBy = "Admin System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("User Referral List");

  worksheet.columns = [
    { header: "No.", key: "stt", width: 10 },
    { header: "Fullname", key: "fullname", width: 30 },
    { header: "Username", key: "username", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Referral Code", key: "referralCode", width: 20 },
    { header: "Total Referrals", key: "totalReferrals", width: 15 },
    { header: "Commission", key: "commissionEarned", width: 20 },
    { header: "Created Date", key: "createdDate", width: 20 },
    { header: "Status", key: "status", width: 17 },
  ];

  users.forEach((user, index) => {
    const statusMap = {
      active: "Active",
      banned: "Blocked",
    };

    worksheet.addRow({
      stt: index + 1,
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      referralCode: user.referralCode || "",
      totalReferrals: user.totalReferrals || 0,
      commissionEarned: user.commissionEarned || 0,
      createdDate: user.createdDate || "",
      status: statusMap[user.status as keyof typeof statusMap] || user.status,
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 12,
      name: "Arial",
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDDEEFF" },
    };
    cell.border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };
  });

  for (let i = 2; i <= users.length + 1; i++) {
    const row = worksheet.getRow(i);
    row.eachCell((cell) => {
      // Add border to all cells
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Căn giữa tất cả các cell
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "User Referral List.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportMiningUsersToExcel = async (users: MiningUser[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Admin System";
  workbook.lastModifiedBy = "Admin System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Mining Users List");

  worksheet.columns = [
    { header: "No.", key: "stt", width: 10 },
    { header: "Fullname", key: "fullname", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Speed Level", key: "speedLevel", width: 15 },
    { header: "Duration Level", key: "durationLevel", width: 15 },
    { header: "Current Balance", key: "currentBalance", width: 20 },
    { header: "Daily Sessions", key: "dailyMiningSessions", width: 15 },
    { header: "Total Claimed", key: "totalClaimed", width: 20 },
    { header: "Created Date", key: "createdDate", width: 20 },
    { header: "Status", key: "status", width: 17 },
  ];

  users.forEach((user, index) => {
    const statusMap = {
      active: "Active",
      blocked: "Blocked",
    };

    const status = user.isBlocked ? "blocked" : "active";

    worksheet.addRow({
      stt: index + 1,
      fullname: user.fullname || "",
      email: user.email || "",
      phone: user.phone || "",
      speedLevel: user.speedLevel || 0,
      durationLevel: user.durationLevel || 0,
      currentBalance: user.currentBalance || 0,
      dailyMiningSessions: user.dailyMiningSessions || 0,
      totalClaimed: user.totalClaimed || 0,
      createdDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "",
      status: statusMap[status as keyof typeof statusMap] || status,
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 12,
      name: "Arial",
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDDEEFF" },
    };
    cell.border = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    };
  });

  for (let i = 2; i <= users.length + 1; i++) {
    const row = worksheet.getRow(i);
    row.eachCell((cell) => {
      // Add border to all cells
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Căn giữa tất cả các cell
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Mining Users List.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
