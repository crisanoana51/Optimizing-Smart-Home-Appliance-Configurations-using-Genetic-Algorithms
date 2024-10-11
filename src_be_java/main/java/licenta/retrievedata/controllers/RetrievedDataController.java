package licenta.retrievedata.controllers;
//
//
//import licenta.retrievedata.services.RetrievedDataService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/data")
//@CrossOrigin(origins = "http://localhost:3000")
//public class RetrievedDataController {
//
//    @Autowired
//    private RetrievedDataService retrievedDataService;
//
//
//    @PostMapping("/retrieveData")
//    public ResponseEntity<?> addData(){
//        retrievedDataService.addData();
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//}
