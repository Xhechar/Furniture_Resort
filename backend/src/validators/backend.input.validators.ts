import joi from 'joi';

export const LoginDetailsSchema = joi.object({
  email: joi.string().required().email().messages({
    'string.required': 'Email is required',
    'string.email': 'Please enter a valid email address.'
  }),
  password: joi.string().min(8).max(30).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8, 30}$')).messages({
    'string.required': 'Please enter password',
    'string.min': 'Password should have more than 8 characters',
    'string.max': 'Password should have less than 30 characters',
    'string.pattern.base': 'Password should contain minimum 8 characters, maximum 30 and should contain special characters'
  })
});

export const RecoveryDetailsSchema = joi.object({
  Email: joi.string().required().email().messages({
    'string.required': 'Email is required',
    'string.email': 'Please enter a valid email address.'
  }),
  Password: joi.string().min(8).max(30).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8, 30}$')).messages({
    'string.required': 'Please enter password',
    'string.min': 'Password should have more than 8 characters',
    'string.max': 'Password should have less than 30 characters',
    'string.pattern.base': 'Password should contain minimum 8 characters, maximum 30 and should contain special characters'
  }),
  RecoveryCode: joi.number().required().messages({
    'number.required': 'Recovery Code is required'
  })
})

export const RegistrationSchema = joi.object({
  Fullname: joi.string().required().min(5).messages({
    'string.required': 'Fullname is required.',
    'string.min': 'Fullname should have 5 characters or more'
  }),
  Email: joi.string().required().email().messages({
    'string.required': 'Email is required.',
    'string.email': 'Please enter a valid email address.'
  }),
  Mobile: joi.string().min(10).max(10).required().messages({
    'string.required': 'Mobile number is required',
    'string.min': 'Mobile number should be strictly 10 characters',
    'string.max': 'Mobile number should be strictly 10 characters'
  }),
  Country: joi.string().min(3).max(30).required().messages({
    'string.required': 'Country Field cannot be empty',
    'string.min': 'Country should have at least 3 characters or more',
    'string.max': 'Country should have less than 39 characters'
  }),
  City: joi.string().min(3).max(30).required().messages({
    'string.required': 'City Field cannot be empty',
    'string.min': 'City should have at least 3 characters or more',
    'string.max': 'City should have less than 39 characters'
  }),
  Gender: joi.string().min(3).max(30).required().messages({
    'string.required': 'Gender Field cannot be empty',
    'string.min': 'Gender should have at least 3 characters or more',
    'string.max': 'Gender should have less than 39 characters'
  }),
  IdentificationNumber: joi.number().min(6).max(10).required().messages({
    'string.required': 'Identification number is required',
    'string.min': 'Identification number should have at least 6 characters or more',
    'string.max': 'Identification number should have less than 10 characters'
  }),
  ProfileImage: joi.string().required().messages({
    'string.required': 'Profile image is required',
  }),
  BackgroundWallpaper: joi.string(),
  Password: joi.string().required().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8, 30}$')).messages({
    'string.required': 'Please enter password',
    'string.min': 'Password should have more than 8 characters',
    'string.max': 'Password should have less than 30 characters',
    'string.pattern.base': 'Password should contain minimum 8 characters, maximum 30 and should contain special characters'
  })
});

export const ProductSchema = joi.object({
  ProductName: joi.string().min(3).max(30).required().messages({
    'string.required': 'Please enter Product Name.',
    'string.min': 'Product Name should have 3 or more characters',
    'string.max': 'Product Name should have 30 characters or less'
  }),
  ProductImages: joi.string().required().messages({
    'string.required': 'Pruduct images are required.'
  }),
  ShortDesc: joi.string().min(3).max(40).required().messages({
    'string.required': 'Please enter Short Description.',
    'string.min': 'Short Description should have 3 or more characters',
    'string.max': 'Short Description should have 40 characters or less'
  }),
  LongDesc: joi.string().min(3).max(240).required().messages({
    'string.required': 'Please enter Long Description.',
    'string.min': 'Long Description should have 3 or more characters',
    'string.max': 'Long Description should have 240 characters or less'
  }),
  Sizes: joi.string().min(3).required().messages({
    'string.required': 'Please enter value.',
    'string.min': 'Sizes should have 3 or more characters',
  }),
  Category: joi.string().min(3).max(30).required().messages({
    'string.required': 'Please enter Category.',
    'string.min': 'Category should have 3 or more characters',
    'string.max': 'Category should have 30 characters or less'
  }),
  Colour: joi.string().min(3).max(30).required().messages({
    'string.required': 'Please enter Colour.',
    'string.min': 'Colour should have 3 or more characters',
    'string.max': 'Colour should have 30 characters or less'
  }),
  Prize: joi.number().required().messages({
    'string.required': 'Prize value is required'
  }),
  StockQuantity: joi.number().required().messages({
    'string.required': 'Stock Quantity value is required'
  }),
  StockLimit: joi.number().required().messages({
    'string.required': 'Stock Limit value is required'
  }),
  CustomPrize: joi.number().required().messages({
    'string.required': 'Custom prize value is required'
  }),
  Discount: joi.number().required().messages({
    'string.required': 'Discount value is required'
  }),
  MakePeriods: joi.number().required().messages({
    'string.required': 'Make periods value is required'
  }),
  Deposit: joi.number().required().messages({
    'string.required': 'Deposit value is required'
  })
});

export const ProductQuantityTimeSchema = joi.object({
  Quantity: joi.number().required().messages({
    'string.required': 'Quantity value is required'
  }),
  Period: joi.number().required().messages({
    'string.required': 'Period value is required'
  })
});

export const ReviewSchema = joi.object({
  ReviewText: joi.string().min(3).max(240).required().messages({
    'string.required': 'Review text is required.',
    'string.min': 'Review text should have 3 or more characters',
    'string.max': 'Review text should have 240 characters or less'
  }),
  Rating: joi.number().min(1).max(5).required().messages({
    'string.required': 'Rating value is required',
    'number.min': 'Rating should be between 1 and 5',
    'number.max': 'Rating should be between 1 and 5'
  })
});