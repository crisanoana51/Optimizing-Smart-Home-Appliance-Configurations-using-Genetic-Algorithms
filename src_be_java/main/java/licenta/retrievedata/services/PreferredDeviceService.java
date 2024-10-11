package licenta.retrievedata.services;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.PreferredDevice;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.repositories.PreferredDeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PreferredDeviceService {

    @Autowired
    private PreferredDeviceRepository preferredDeviceRepository;

    public PreferredDevice addPreferredDevice(User user, Device device) {
        PreferredDevice preferredDevice = new PreferredDevice();
        preferredDevice.setUser(user);
        preferredDevice.setDevice(device);
        return preferredDeviceRepository.save(preferredDevice);
    }

    public List<PreferredDevice> getPreferredDevices(User user) {
        return preferredDeviceRepository.findByUser(user);
    }
}
