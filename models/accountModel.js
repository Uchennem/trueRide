const User = require('./accountModelMongoose')

async function getUsername(user_email) {
  try {
    const user = await User.findOne({ account_email: user_email }).lean()

    if (!user) {
      return null
    }

    // Combine first + last name (or return email if name missing)
    return `${user.account_firstname} ${user.account_lastname}`.trim() || user.account_email
  } catch (error) {
    console.error("Error fetching username:", error.message)
    throw error
  }
}

async function updateAccountTypeByEmail(account_email, newRole) {
  try {
    const result = await User.findOneAndUpdate(
      { account_email },
      { $set: { account_type: newRole } },
      { new: true } // returns updated doc
    );
    return result;
  } catch (err) {
    console.error("Error updating account type:", err);
    throw err;
  }
}


module.exports = {getUsername, updateAccountTypeByEmail}
