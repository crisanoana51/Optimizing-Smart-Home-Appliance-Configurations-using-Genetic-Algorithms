package licenta.retrievedata.services;
//
//
//import licenta.retrievedata.entitites.RetrievedData;
//import licenta.retrievedata.repositories.RetrievedDataRepository;
//import licenta.retrievedata.util.ExcelReader;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class RetrievedDataService {
//
//    private final ExcelReader excelService;
//
//    private RetrievedDataRepository retrievedDataRepository;
//
//
//
//    @Autowired
//    public RetrievedDataService(ExcelReader excelService, RetrievedDataRepository retrievedDataRepository) {
//        this.excelService = excelService;
//        this.retrievedDataRepository = retrievedDataRepository;
//    }
//
//
//    public void addData() {
//        List<RetrievedData> data = excelService.readExcelFile();
//        for(RetrievedData p : data) {
//            retrievedDataRepository.save(p);
//        }
//    }
//
//    public RetrievedData updateData(RetrievedData retrievedData) {
//        return retrievedDataRepository.save(retrievedData);
//
//    }
//
//    public void deleteData(Long id) {
//        retrievedDataRepository.deleteById(id);
//    }
//}
