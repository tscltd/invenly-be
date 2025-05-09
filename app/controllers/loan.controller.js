const Loan = require('../models/loan.model');
const Item = require('../models/item.model');
const mongoose = require('mongoose');

exports.createLoans = async (req, res) => {
  const { codes, borrowerName, returnDueDate } = req.body;
  const userId = req.userId; // từ middleware xác thực JWT nếu có

  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    return res.status(400).json({ error: 'Chưa truyền danh sách mã vật phẩm' });
  }

  try {
    const items = await Item.find({ code: { $in: codes }, isDeleted: { $ne: true } });

    if (items.length !== codes.length) {
      return res.status(400).json({ error: 'Một số mã vật phẩm không tồn tại' });
    }

    const now = new Date();
    const loans = [];

    for (const item of items) {
      if (item.isLoaned) continue;

      const loan = new Loan({
        itemId: item._id,
        borrowerName,
        loanDate: now,
        returnDueDate: returnDueDate || null,
        status: 'borrowed',
        createdBy: userId,
      });

      await loan.save();
      item.isLoaned = true;
      await item.save();

      loans.push(loan);
    }

    res.json({ message: `Đã tạo ${loans.length} phiếu mượn`, loans });
  } catch (err) {
    console.error('[LOAN ERROR]', err);
    res.status(500).json({ error: 'Lỗi server khi tạo phiếu mượn' });
  }
};
