const User = require("../models/user");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "sample_url" },
    });
    const token = await user.generateToken();
    console.log(token);
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      res.status(400).json({
        success: false,
        message: "user does not exist",
      });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      res.status(400).json({
        success: false,
        message: "incorrect password",
      });

    const token = await user.generateToken();
    console.log(token);
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {}
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    if (userToFollow._id.toString() === req.user._id.toString())
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    const loggedInUser = await User.findById(req.user._id);
    if (loggedInUser.following.includes(userToFollow._id)) {
      const index = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(index, 1);
      const index2 = userToFollow.followers.indexOf(req.user._id);
      userToFollow.followers.splice(index2, 1);
      await loggedInUser.save();
      await userToFollow.save();
      return res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(req.user._id);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
