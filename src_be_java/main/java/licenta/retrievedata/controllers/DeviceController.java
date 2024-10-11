package licenta.retrievedata.controllers;


import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.PreferredDevice;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.services.DeviceService;
import licenta.retrievedata.services.PreferredDeviceService;
import licenta.retrievedata.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/device")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private PreferredDeviceService preferredDeviceService;

    @Autowired
    private UserService userService;

    @PostMapping("/convert")
    public ResponseEntity<?> convertData(){
        deviceService.convertData();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{userId}")
    public PreferredDevice addPreferredDevice(@PathVariable Long userId, @RequestParam Long deviceId) {
        User user = userService.findById(userId);
        Device device = deviceService.findById(deviceId);
        return preferredDeviceService.addPreferredDevice(user, device);
    }

    @GetMapping("/{userId}")
    public List<PreferredDevice> getPreferredDevices(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return preferredDeviceService.getPreferredDevices(user);
    }
}
