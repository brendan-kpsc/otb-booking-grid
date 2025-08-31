import PageInputEntityRecord = Xrm.Navigation.PageInputEntityRecord;
import NavigationOptions = Xrm.Navigation.NavigationOptions;

interface QuickCreateFormParameters extends Xrm.Utility.OpenParameters {
    slc_bookingunitid: string;
    slc_startdate: string;
}

const openQuickCreateForm = (formParameters: QuickCreateFormParameters, callback: () => void) => {
    const entityFormOptions: any = {};

    entityFormOptions["entityName"] = "slc_mooragereservation";

    entityFormOptions["createFromEntity"] = {
        "entityType": "slc_moorageunit",
        "id": formParameters.slc_bookingunitid
    };

    const start_date = new Date(formParameters.slc_startdate)

    // "slc_startdate": new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate())
    // Prepopulate values
    const data = {
        "slc_startdate": new Date(2025, 10, 25) // Month is zero-based (10 = November)
    };

    const pageInput: PageInputEntityRecord = {
        pageType: "entityrecord",
        entityName: "slc_mooragereservation",
        // formId: "1EBB5A9B-E363-4DE6-860C-C54D60290887", // optional specific form
        createFromEntity: entityFormOptions["createFromEntity"],
        data: data
    };

    const navigationOptions: NavigationOptions = {
        target: 2,
        height: { value: 80, unit: "%" },
        width: { value: 70, unit: "%" },
        position: 1
    };

    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
        function success(result) {
        },
        function error(err) {
            console.error("navigateTo Error: " + err.message);
        }
    ).then(() => callback());
}

export default openQuickCreateForm;