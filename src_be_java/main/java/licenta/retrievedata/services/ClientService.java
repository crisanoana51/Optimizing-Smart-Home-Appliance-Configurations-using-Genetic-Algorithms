package licenta.retrievedata.services;


import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    @Autowired
    private DeviceRepository deviceRepository;

    public List<String> getDeviceTypes(){
        return deviceRepository.findDistinctDeviceTypes();
    }



}
