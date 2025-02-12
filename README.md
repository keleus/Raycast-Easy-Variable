# EasyVariable

EasyVariable is a Raycast extension that helps developers quickly generate standardized English variable names. It supports converting text from any language (such as Chinese, Japanese, etc.) into programming-compliant English variable names.

## Features

- Support multiple variable naming styles
  - CONSTANT_CASE
  - camelCase
  - PascalCase
  - snake_case
  - kebab-case

- Multiple translation engines support
  - Youdao Translate (Enabled by default, no configuration needed)
  - Google Translate (Proxy required in certain regions)
  - OpenAI (Custom API supported)
  - Tencent Translate
  - GLM (ZhipuAI,GLM-4-Flash is Free)
  - Deepseek

## How to Use

1. Enter the text you want to convert in Raycast
2. Choose your desired variable naming style
3. The extension will automatically translate and generate variable names in the corresponding format
4. Copy or paste directly into your code

## Configuration

### Basic Settings
- HTTP Proxy: Required for services like Google Translate
- Translation Source Selection: Enable/disable different translation services

### API Configuration (Optional)
- OpenAI API Baseurl/API Key/Model
- Tencent Translate(Tencent Cloud tmt Service) SecretId/SecretKey
- GLM(ZhipuAI) API Key
- Deepseek API Key

## Example

Input：`用户名称`
Output：
- CONSTANT: USER_NAME
- camelCase: userName
- PascalCase: UserName
- snake_case: user_name
- kebab-case: user-name

## Key Features

- Multiple translation sources for improved accuracy
- Automatic merging of identical translation results, prioritizing recommendations from multiple sources
- Real-time translation with quick response
- Custom API support for service stability