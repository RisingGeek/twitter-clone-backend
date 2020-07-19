module.exports = {
    editUser: (req, res) => {
        return res.status(200).json({ success: true, data: 'user edited' });
    }
}