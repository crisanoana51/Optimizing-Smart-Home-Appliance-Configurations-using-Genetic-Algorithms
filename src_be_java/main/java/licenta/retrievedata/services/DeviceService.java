package licenta.retrievedata.services;


import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.repositories.DeviceRepository;
import licenta.retrievedata.repositories.RetrievedDataRepository;
import licenta.retrievedata.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {



    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private RetrievedDataRepository retrievedDataRepository;

    @Autowired
    private MapperFreezers mapperFreezers;

    @Autowired
    private MapperWashingMachine mapperWashingMachine;

    @Autowired
    private MapperDishwasher mapperDishwasher;

    @Autowired
    private MapperOven mapperOven;

    @Autowired
    private MapperHob mapperHob;

    public void convertData(){
        for(RetrievedData rd : retrievedDataRepository.findAll()){
            Device device = new Device();
            //device = mapperFreezers.convertToDeviceFreezer(rd);
            //device = mapperWashingMachine.convertToDeviceWashingMachine(rd);
            //device = mapperDishwasher.convertToDishwasher(rd);
            //device = mapperOven.convertToOven(rd);
            device = mapperHob.convertToHob(rd);
            deviceRepository.save(device);

        }
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Device findById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Device is not found."));
    }

    public List<Device> getFilteredDevices(String category, double minPrice, double maxPrice) {
        if (category == null || category.isEmpty()) {
            return deviceRepository.findByPriceBetween(minPrice, maxPrice);
        } else {
            return deviceRepository.findByCategoryAndPriceBetween(category, minPrice, maxPrice);
        }
    }

}
