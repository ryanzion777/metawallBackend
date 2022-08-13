// User Controller
const User = require('../models/User')
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')

/*
  取得目前使用者資訊 GET
*/
const getUserInfo = catchAsync(async (req, res, next) => {
  const { user_id } = req.params

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  const data = await User.findById(user_id)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得使用者資料成功',
    data
  })
})

/*
  更新使用者資訊 PATCH
*/
const updateUserInfo = catchAsync(async (req, res, next) => {
  const { user_id } = req.params
  let { name, avatar } = req.body
  const new_data = {}
  name = name.trim()

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  if (name !== undefined && name?.length >= 2) {
    new_data.name = name
  } else {
    return next(
      appError(
        {
          message: '暱稱至少 ２ 字元以上',
          statusCode: 400
        },
        next
      )
    )
  }

  if (avatar !== undefined) {
    new_data.avatar = avatar
  }

  const data = await User.findByIdAndUpdate(user_id, new_data, {
    runValidators: true,
    new: true
  })
  if (!data) {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }

  successHandle({ res, message: '更新使用者資料成功', data })
})

/*
  刪除目前使用者資訊 DELETE
*/
const deleteUserInfo = catchAsync(async (req, res, next) => {
  const { user_id } = req.params

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  const data = await User.findByIdAndDelete(user_id)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '刪除使用者資料成功',
    data
  })
})

module.exports = {
  getUserInfo,
  deleteUserInfo,
  updateUserInfo
}
