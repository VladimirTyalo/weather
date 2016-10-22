module.exports = {
  lint: {
    JS_FILES: ["src/js/**/*.js", "!src/js/vendor/**/*.js"],
    STYLE_FILES: ["src/css/**/*"],
    HTML_FILES: ["src/**/*.html"],
    options: {
      HTML: {
        "attr-lowercase": ["viewBox"]
      },
      STYLE: {

        // "extends": "stylelint-config-standard",
        //"extends": "stylelint-config-idiomatic-order",
        "rules": {
          "block-no-empty": true,
          "color-no-invalid-hex": true,
          "declaration-colon-space-after": "always",
          "declaration-colon-space-before": "never",
          "function-comma-space-after": "always",
          "media-feature-colon-space-after": "always",
          "media-feature-colon-space-before": "never",
          "media-feature-name-no-vendor-prefix": true,
          "max-empty-lines": 5,
          "number-leading-zero": "always",
          "number-no-trailing-zeros": true,
          "property-no-vendor-prefix": true,
          "selector-list-comma-space-before": "never",
          "selector-list-comma-newline-after": "always",
          "selector-no-id": true,
          "string-quotes": "double",
          "value-no-vendor-prefix": true,
          "indentation": 2
        }
      }
    }
  }
};