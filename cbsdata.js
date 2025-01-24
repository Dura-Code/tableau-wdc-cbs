(function () {
    $(document).ready(function () {
        var myConnector = tableau.makeConnector();

        myConnector.getSchema = function (schemaCallback) {
            var cols = [
                {
                    id: "Perioden",
                    alias: "Periode",
                    dataType: tableau.dataTypeEnum.date
                },
                {
                    id: "Consumentenvertrouwen_1",
                    alias: "Consumentenvertrouwen",
                    dataType: tableau.dataTypeEnum.float
                },
                {
                    id: "EconomischKlimaat_2",
                    alias: "Economische klimaat",
                    dataType: tableau.dataTypeEnum.float
                },
                {
                    id: "Koopbereidheid_3",
                    alias: "Koopbereidheid",
                    dataType: tableau.dataTypeEnum.float
                },
                {
                    id: "GunstigeTijdVoorGroteAankopen_8",
                    alias: "Gunstige tijd voor grote aankopen",
                    dataType: tableau.dataTypeEnum.float
                }
            ];

            var tableSchema = {
                id: "cbsdata",
                alias: "CBS data",
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

                    function convertPeriodToDate(period) {
                        // Extract the year and month from the string
                        const year = period.slice(0, 4); // First 4 characters represent the year
                        const month = period.slice(6, 8); // Characters after "MM" represent the month
                    
                        // Return the formatted date string in "YYYY-MM" format
                        return `${year}-${month}`;
                    }

                    for (var i = 0; i < results.length; i++) {
                        const row = {
                            "Perioden": convertPeriodToDate(results[i].Perioden),
                            "Consumentenvertrouwen_1": results[i].Consumentenvertrouwen_1,
                            "EconomischKlimaat_2": results[i].EconomischKlimaat_2,
                            "Koopbereidheid_3": results[i].Koopbereidheid_3,
                            "GunstigeTijdVoorGroteAankopen_8": results[i].GunstigeTijdVoorGroteAankopen_8
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
            tableau.connectionName = "CBS Web Data Connector";
            tableau.submit();
        });
    });
})();