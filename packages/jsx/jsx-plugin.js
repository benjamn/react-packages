var handler = function (compileStep) {
  var source = compileStep.read().toString('utf8');
  var outputFile = compileStep.inputPath + ".js";
  var babelOptions = Babel.getDefaultOptions({
    react: true
  });

  babelOptions.sourceMap = true;
  babelOptions.filename = compileStep.pathForSourceMap;
  babelOptions.sourceMapName = compileStep.pathForSourceMap;

  try {
    var result = Babel.transformMeteor(source, babelOptions);
  } catch (e) {
    if (e.loc) {
      // Babel error
      compileStep.error({
        message: e.message,
        sourcePath: compileStep.inputPath,
        line: e.loc.line,
        column: e.loc.column
      });
      return;
    } else {
      throw e;
    }
  }

  compileStep.addJavaScript({
    path: outputFile,
    sourcePath: compileStep.inputPath,
    data: result.code,
    sourceMap: JSON.stringify(result.map)
  });
};

Plugin.registerSourceHandler('jsx', handler);
