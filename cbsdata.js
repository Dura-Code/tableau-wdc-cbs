(function () {
    $(document).ready(function () {
        var myConnector = tableau.makeConnector();

        myConnector.getSchema = function (schemaCallback) {
            var cols = [
                {
                    id: "Perioden",
                    alias: "Period",
                    dataType: tableau.dataTypeEnum.string
                },
                {
                    id: "Consumentenvertrouwen_1",
                    alias: "Consumer Confidence",
                    dataType: tableau.dataTypeEnum.float
                },
                {
                    id: "EconomischKlimaat_2",
                    alias: "Economic Climate",
                    dataType: tableau.dataTypeEnum.float
                },
                {
                    id: "Koopbereidheid_3",
                    alias: "Willingness to Buy",
                    dataType: tableau.dataTypeEnum.float
                }
            ];

            var tableSchema = {
                id: "consumerConfidence",
                alias: "Consumer Confidence Data from CBS",
                columns: cols
            };

            schemaCallback([tableSchema]);
        };

        myConnector.getData = function (table, doneCallback) {
            const url = 'https://opendata.cbs.nl/ODataApi/odata/83693NED/TypedDataSet';

            $.ajax({
                dataType: "json",
                url: url,
                success: function (data) {
                    const allRows = [];
                    const results = data.value;

                    for (var i = 0; i < results.length; i++) {
                        const row = {
                            "Perioden": results[i].Perioden,
                            "Consumentenvertrouwen_1": results[i].Consumentenvertrouwen_1,
                            "EconomischKlimaat_2": results[i].EconomischKlimaat_2,
                            "Koopbereidheid_3": results[i].Koopbereidheid_3
                        };
                        allRows.push(row);
                    }

                    table.appendRows(allRows);
                    doneCallback();
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching data: ", error);
                    doneCallback();
                }
            });
        };

        tableau.registerConnector(myConnector);

        $("#submitButton").click(function () {
            tableau.connectionName = "CBS Consumer Confidence Data";
            tableau.submit();
        });
    });
})();