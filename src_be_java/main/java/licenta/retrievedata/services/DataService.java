package licenta.retrievedata.services;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import licenta.retrievedata.repositories.DeviceRepository;
import licenta.retrievedata.repositories.RetrievedDataRepository;
import licenta.retrievedata.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Function;

@Service
public class DataService {

    @Autowired
    private final ExcelReader excelReader;

    @Autowired
    private RetrievedDataRepository retrievedDataRepository;

    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private MapperDishwasher mapperDishwasher;
    @Autowired
    private MapperFreezers mapperFreezers;
    @Autowired
    private MapperHob mapperHob;
    @Autowired
    private MapperOven mapperOven;
    @Autowired
    private MapperWashingMachine mapperWashingMachine;

    @Autowired
    private MapperStove mapperStove;


    @Autowired
    private MapperHood mapperHood;

    public DataService(ExcelReader excelReader, RetrievedDataRepository retrievedDataRepository, DeviceRepository deviceRepository,
                       MapperDishwasher mapperDishwasher, MapperFreezers mapperFreezers, MapperHob mapperHob, MapperOven mapperOven,
                       MapperWashingMachine mapperWashingMachine, MapperStove mapperStove) {
        this.excelReader = excelReader;
        this.retrievedDataRepository = retrievedDataRepository;
        this.deviceRepository = deviceRepository;
        this.mapperDishwasher = mapperDishwasher;
        this.mapperFreezers = mapperFreezers;
        this.mapperHob = mapperHob;
        this.mapperOven = mapperOven;
        this.mapperWashingMachine = mapperWashingMachine;
        this.mapperStove = mapperStove;
    }

    @Transactional
    public void retrieveAndConvert() {
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\plita.xlsx", mapperHob::convertToHob);
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\aparatefrigorifice.xlsx", mapperFreezers::convertToDeviceFreezer);
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\masinivase.xlsx", mapperDishwasher::convertToDishwasher);
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\masinihaine.xlsx", mapperWashingMachine::convertToDeviceWashingMachine);
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\cuptoare.xlsx", mapperOven::convertToOven);
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\aragaz.xlsx", mapperStove::convertToStove);
        processFile("C:\\Users\\Oana\\Desktop\\UTCN AC\\Facultate - anul 4\\Licenta yuck\\retrievedata\\hote.xlsx", mapperHood::convertToHood);
    }

    private void processFile(String filePath, Function<RetrievedData, Device> converter) {
        List<RetrievedData> data = excelReader.readExcelFile(filePath);
        System.out.println("Read " + data.size() + " entries from " + filePath);
        if (data == null || data.isEmpty()) {
            System.out.println("No data found in file: " + filePath);
            return;
        }

        for (RetrievedData p : data) {
            retrievedDataRepository.save(p);
        }

        for (RetrievedData rd : retrievedDataRepository.findAll()) {
            Device device = converter.apply(rd);
            deviceRepository.save(device);
        }

        retrievedDataRepository.deleteAll();
    }

    public List<Device> getFilteredDevices(String category, double minPrice, double maxPrice) {
        if (category == null || category.isEmpty()) {
            return deviceRepository.findByPriceBetween(minPrice, maxPrice);
        } else {
            return deviceRepository.findByCategoryAndPriceBetween(category, minPrice, maxPrice);
        }
    }
}
