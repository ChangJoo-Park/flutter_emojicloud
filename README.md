# Flutter EmojiCloud

A Flutter package using vector emoji from [emojicloud](https://github.com/alohe/emojicloud).

This pakcage has no any other dependencies. It does not break your [flutter_svg](https://pub.dev/packages/flutter_svg) dependency.

![](demo.gif)


## Installation

```
flutter pub add emojis
flutter pub add flutter_svg
```


## Use with flutter_svg

```
SvgPicture.asset(
    EmojiCloud.airplane,
    package: 'emojicloud', // this line is required. :)
    width: 200,
    height: 200,
),
```
